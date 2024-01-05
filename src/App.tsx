import { Suspense, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import qs from 'qs';
import find from 'lodash/find';
import lazyWithPreload from 'react-lazy-with-preload';

import * as Sentry from '@sentry/react';
import { interceptAxios } from 'utils/axios';
import { languageList, fallbackLng } from 'utils/i18n';
import { useTranslation } from 'react-i18next';
import { useGrowthBook } from '@growthbook/growthbook-react';

import { useUserData } from 'hooks/useUserData';
import { authUserWithToken } from 'store/actions/userActions';

import Routes from 'Routes';
import Navigation from 'components/Navigation';
import Footer from './components/Footer';
import AlertZone from './components/AlertZone';
import AnalyticsListener from './components/AnalyticsListener';
import UpdateToast from './components/UpdateToast';

import { RootState } from 'store';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from 'hooks/useLanguage';

import Spinner from 'components/Spinner';
import { SettingsModalContext } from 'components/SettingsModal/SettingsModalContext';
const SettingsModal = lazyWithPreload(() => import('components/SettingsModal'));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const growthbook = useGrowthBook();
  const { setLanguage } = useLanguage();
  const { isLoggedIn, user } = useUserData();

  // This is used to trigger a suspense while i18n is loading
  const { ready: i18nReady } = useTranslation();

  // ToDo: remove this feature?
  const versionUpdateReady = useSelector((state: RootState) => state.updates.newVersionReady);

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
        // Clear the URL, but keep any alert (so login errors are shown)
        navigate('/', { replace: true, state: { keepAlerts: true } });
        authUserWithToken(dispatch)(token).finally(() =>
          queryClient.invalidateQueries({
            queryKey: ['user'],
          })
        );
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
    if (isLoggedIn) SettingsModal.preload();
  }, [isLoggedIn]);

  useEffect(() => {
    if (process.env.REACT_APP_SENTRY_DSN) {
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
      <div className="d-flex flex-column" style={{ height: 'calc(100vh - 84px)' }}>
        {process.env.REACT_APP_ANALYTICS_CODE && <AnalyticsListener />}
        {versionUpdateReady && <UpdateToast />}

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
