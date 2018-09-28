import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootswatch/dist/slate/bootstrap.min.css';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import { Provider as ReduxProvider } from 'react-redux';
import store from './store';

import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    debug: process.env.NODE_ENV === 'development',
    release: process.env.REACT_APP_VERSION,
    environment: process.env.NODE_ENV,
    sanitizeKeys: [/token/],
  });
}

if (process.env.REACT_APP_ANALYTICS_CODE) {
  const appVersion = process.env.REACT_APP_VERSION;
  const userId = localStorage.getItem('hashedUID');
  let clientId = localStorage.getItem('GA_LOCAL_STORAGE_KEY');

  if (!clientId) {
    let cookieID = document.cookie.match(/PHPSESSID=([^;]*)/);
    if (cookieID) {
      clientId = cookieID[1];
    }
  }

  ReactGA.initialize(process.env.REACT_APP_ANALYTICS_CODE, {
    debug: process.env.NODE_ENV === 'development',
    gaOptions: {
      clientId,
      userId,
    }
  });

  ReactGA.set({
    appName: 'Open Scrobbler',
    appVersion,
  });
}

ReactDOM.render(
  <ReduxProvider store={store}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </ReduxProvider>,
  document.getElementById('root')
);
registerServiceWorker(store);
