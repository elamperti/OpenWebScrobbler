import { Suspense, useEffect, useState } from 'react';
import { useGrowthBook } from '@growthbook/growthbook-react';
import * as Sentry from '@sentry/react';
import { find } from 'lodash-es';
import qs from 'qs';
import { useTranslation } from 'react-i18next';
import lazyWithPreload from 'react-lazy-with-preload';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Routes from 'Routes';
import { useRegisterSW } from 'virtual:pwa-register/react';

import AlertZone from 'components/AlertZone';
import AnalyticsListener from 'components/AnalyticsListener';
import Footer from 'components/Footer';
import Navigation from 'components/Navigation';
import { SettingsModalContext } from 'components/SettingsModal/SettingsModalContext';
import Spinner from 'components/Spinner';
import UpdateToast from 'components/UpdateToast';
import { useLanguage } from 'hooks/useLanguage';
import { useUserData } from 'hooks/useUserData';
import { interceptAxios } from 'utils/axios';
import { fallbackLng, languageList } from 'utils/i18n';

const SettingsModal = lazyWithPreload(() => import('components/SettingsModal'));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const growthbook = useGrowthBook();
  const { setLanguage } = useLanguage();
  const { isLoggedIn, user } = useUserData();
  const serviceWorker = useRegisterSW();

  // This is used to trigger a suspense while i18n is loading
  const { ready: i18nReady } = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (growthbook && growthbook.ready === false) {
      growthbook.loadFeatures();
    }
  }, [growthbook]);

  useEffect(() => {
    // Things break if this interceptor is applied more than once!
    interceptAxios(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const queryString = qs.parse(location.search, { ignoreQueryPrefix: true });

    if (location.search && !isLoggedIn) {
      const token = queryString.token || null;
      if (token) {
        // Redirect to callback handler, keep alerts
        navigate(`/lastfm/callback/?token=${token}`, { replace: true, state: { keepAlerts: true } });
      }
    }

    // ToDo: Move this to a better place
    if (queryString.hl) {
      if (
        find(languageList, { code: queryString.hl }) ||
        Object.prototype.hasOwnProperty.call(fallbackLng, queryString.hl)
      ) {
        setLanguage(queryString.hl.toString());
      }
    }
    // Including `navigate` in this array causes a bug in album search, see #220
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isLoggedIn, location.search]);

  useEffect(() => {
    if (process.env.REACT_APP_SENTRY_DSN && Sentry.isInitialized()) {
      if (user?.name) {
        Sentry.setUser({
          username: user.name,
          ip: '{{auto}}',
        });
      } else {
        Sentry.setUser(null);
      }
    }
  }, [user]);

  const LoadingSpinner = (
    <div id="ows-loading">
      <Spinner noTranslation={!i18nReady} />
    </div>
  );

  return (
    <Suspense fallback={LoadingSpinner}>
      <SettingsModalContext.Provider value={{ isOpen: modalIsOpen, setSettingsModalVisible: setModalIsOpen }}>
        {isLoggedIn && <SettingsModal />}
        <Navigation />
      </SettingsModalContext.Provider>
      <div className="d-flex flex-column" style={{ height: 'calc(100vh - 86px)' }}>
        {process.env.REACT_APP_ANALYTICS_CODE && <AnalyticsListener />}
        {serviceWorker.needRefresh[0] && <UpdateToast onUpdate={serviceWorker.updateServiceWorker} />}

        <AlertZone />
        <main className="container flex-wrap flex-grow-1">
          <Routes />
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}

export default App;
