import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from 'App';
import ErrorPage from 'domains/error';
import registerServiceWorker from 'utils/registerServiceWorker';
import 'bootswatch/dist/slate/bootstrap.min.css';

import { Provider as ReduxProvider } from 'react-redux';
import store from 'store';

import ReactGA from 'react-ga';
import * as Sentry from '@sentry/react';

import 'utils/i18n';

// Avoid proxies that may interfer with the site
if (process.env.NODE_ENV !== 'development' && document.location.host !== process.env.REACT_APP_HOST) {
  // eslint-disable-next-line no-restricted-globals
  parent.window.location.href = `//${process.env.REACT_APP_HOST}/`;
}

// Break out of frames
// eslint-disable-next-line no-restricted-globals
if (top.location !== self.location) {
  // eslint-disable-next-line no-restricted-globals
  top.location = self.location.href;
}

const sentryEnabled = !!process.env.REACT_APP_SENTRY_DSN;
if (sentryEnabled) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    debug: process.env.NODE_ENV === 'development',
    release: process.env.REACT_APP_VERSION,
    environment: process.env.NODE_ENV,
    sanitizeKeys: [/token/],
    ignoreErrors: ['ResizeObserver'],
    ignoreUrls: [
      // Avoid browser extensions reporting errors
      /extensions\//i,
      /^chrome:\/\//i,
    ],
  });
}

if (process.env.REACT_APP_ANALYTICS_CODE) {
  const appVersion = process.env.REACT_APP_VERSION;
  let userId;
  let clientId;

  try {
    userId = localStorage.getItem('hashedUID');
    clientId = localStorage.getItem('GA_LOCAL_STORAGE_KEY');
  } catch (err) {
    const cookieID = document.cookie.match(/PHPSESSID=([^;]*)/);
    if (cookieID) {
      clientId = cookieID[1];
    }
  }

  ReactGA.initialize(process.env.REACT_APP_ANALYTICS_CODE, {
    debug: process.env.NODE_ENV === 'development',
    gaOptions: {
      clientId,
      userId,
    },
    onerror: (err) => {
      // eslint-disable-next-line no-console
      console.debug('⚠️ Unable to load Google Analytics'); // (I'm avoiding console.warn here)
      err.stopPropagation();
    },
    testMode: process.env.NODE_ENV === 'test',
  });

  ReactGA.set({
    appName: 'Open Scrobbler',
    appVersion,
  });
}

const baseApp = (
  <ReduxProvider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReduxProvider>
);

ReactDOM.render(
  sentryEnabled ? <Sentry.ErrorBoundary fallback={ErrorPage}>{baseApp}</Sentry.ErrorBoundary> : baseApp,
  document.getElementById('root')
);
registerServiceWorker(store);
