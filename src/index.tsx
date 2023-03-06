import React from 'react';
import ReactDOM from 'react-dom/client';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';

import './index.css';
import App from 'App';
import history from 'utils/history';
import ErrorPage from 'domains/error/ErrorPage';
import * as serviceWorkerRegistration from 'utils/serviceWorkerRegistration';
// import reportWebVitals from 'utils/reportWebVitals';

import 'bootswatch/dist/slate/bootstrap.min.css';

import { Provider as ReduxProvider } from 'react-redux';
import store from 'store';

import ReactGA from 'react-ga';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';

import 'utils/i18n';
import { NEW_VERSION_READY } from 'Constants';

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

let wrappedApp = (
  <ReduxProvider store={store}>
    {/* @ts-ignore https://github.com/remix-run/react-router/issues/9630 */}
    <HistoryRouter history={history}>
      <App />
    </HistoryRouter>
  </ReduxProvider>
);

const sentryEnabled = !!process.env.REACT_APP_SENTRY_DSN;
if (sentryEnabled) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    debug: process.env.NODE_ENV === 'development',
    release: process.env.REACT_APP_VERSION,
    environment: process.env.NODE_ENV,
    // @ts-ignore (sanitizeKeys is a valid property)
    sanitizeKeys: [/token/],
    ignoreErrors: ['ResizeObserver'],
    ignoreUrls: [
      // Avoid browser extensions reporting errors
      /extensions\//i,
      /^chrome:\/\//i,
    ],
    integrations: [new BrowserTracing(), new Sentry.Replay()],
    replaysSessionSampleRate: process.env.NODE_ENV === 'development' ? 1 : 0.02,
    replaysOnErrorSampleRate: 1.0,
    tracesSampleRate: process.env.NODE_ENV === 'development' ? 0.2 : 0.05,
  });

  wrappedApp = <Sentry.ErrorBoundary fallback={ErrorPage}>{wrappedApp}</Sentry.ErrorBoundary>;
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

  // @ts-ignore (we need to keep onerror)
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

const growthbookEnabled = !!process.env.REACT_APP_GROWTHBOOK_API_KEY;
if (growthbookEnabled) {
  const growthbook = new GrowthBook({
    apiHost: 'https://cdn.growthbook.io',
    clientKey: process.env.REACT_APP_GROWTHBOOK_API_KEY,
    enableDevMode: process.env.NODE_ENV === 'development',
    trackingCallback: (experiment, result) => {
      ReactGA.event({
        category: 'Experiments',
        action: 'Viewed Experiment',
        label: experiment.key,
        value: result.variationId,
      });
      if (sentryEnabled) {
        Sentry.setTag(`experiment-${experiment.key}`, result.variationId);
      }
    },
  });
  wrappedApp = <GrowthBookProvider growthbook={growthbook}>{wrappedApp}</GrowthBookProvider>;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(wrappedApp);

serviceWorkerRegistration.register({
  onUpdate: () => {
    store.dispatch({
      type: NEW_VERSION_READY,
    });
  },
});

// Measure performance Learn more: https://bit.ly/CRA-vitals
// ToDo: Analyze if this is worth using
// reportWebVitals(process.env.NODE_ENV === 'development' ? console.log : undefined);
