import React, { Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { changeLanguage } from 'i18next';
import qs from 'qs';
import find from 'lodash/find';

import { interceptAxios } from 'utils/axios';
import { languageList, fallbackLng } from 'utils/i18n';

import { authUserWithToken, getUserInfo } from 'store/actions/userActions';

import Routes from 'Routes';
import Navigation from 'components/Navigation';
import Footer from './components/Footer';
import AlertZone from './components/AlertZone';
import AnalyticsListener from './components/AnalyticsListener';
import UpdateToast from './components/UpdateToast';

import Spinner from 'components/Spinner';
import SettingsModal from 'components/SettingsModal';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const versionUpdateReady = useSelector((state) => state.updates.newVersionReady);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

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
        authUserWithToken(dispatch)(token);
      }
    } else {
      getUserInfo(dispatch)();
    }

    // ToDo: Move this to a better place
    if (queryString.hl) {
      if (
        find(languageList, { code: queryString.hl }) ||
        Object.prototype.hasOwnProperty.call(fallbackLng, queryString.hl)
      ) {
        changeLanguage(queryString.hl);
      }
    }
  }, [dispatch, navigate, isLoggedIn, location.search]);

  const loadingSpinner = (
    <div id="ows-loading">
      <Spinner />
    </div>
  );

  return (
    <Suspense fallback={loadingSpinner}>
      <SettingsModal />
      <Navigation />
      <div className="d-flex flex-column" style={{ height: 'calc(100vh - 80px)' }}>
        {process.env.REACT_APP_ANALYTICS_CODE && <AnalyticsListener />}
        {versionUpdateReady && <UpdateToast />}

        <div className="container">
          <AlertZone />
        </div>
        <main className="container flex-wrap flex-grow-1">
          <Routes />
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}

export default App;
