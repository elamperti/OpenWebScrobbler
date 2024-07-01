import ReactDOM from 'react-dom/client';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';

import './index.css';
import App from 'App';
import history from 'utils/history';
import ErrorPage from 'domains/error/ErrorPage';
// import reportWebVitals from 'utils/reportWebVitals';

import 'bootswatch/dist/slate/bootstrap.min.css';

import { Provider as ReduxProvider } from 'react-redux';
import store from 'store';
import ReactGA from 'react-ga-neo';
import * as Sentry from '@sentry/react';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';

import 'utils/i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { tweak } from 'utils/tweaks/Tweaks';

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

const sentryEnabled = !!process.env.REACT_APP_SENTRY_DSN && tweak(true, 'Sentry', 'Enabled');
if (sentryEnabled) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    debug: tweak(false, 'Sentry', 'Debug'),
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
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay({
        maskAllText: false,
      }),
    ],
    replaysSessionSampleRate: process.env.NODE_ENV === 'development' ? 0 : 0.02,
    replaysOnErrorSampleRate: 0.75,
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
  } catch (err) {
    // pass
  }

  if (document?.cookie) {
    const match = document.cookie.match(/PHPSESSID=([^;]*)/);
    clientId = match ? match[1] : undefined;
  }

  // @ts-ignore (we need to keep onerror)
  ReactGA.initialize(process.env.REACT_APP_ANALYTICS_MEASUREMENT_ID, {
    // debug: tweak(false, 'Analytics', 'Debug'),
    gaOptions: {
      clientId,
      userId,
    },
    testMode: process.env.NODE_ENV === 'test',
    titleCase: true,
  });

  ReactGA.set({
    appName: 'Open Scrobbler',
    appVersion,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // minutes
    },
  },
});
wrappedApp = (
  <QueryClientProvider client={queryClient}>
    <>
      {wrappedApp}
      {!process.env.NO_DEVTOOLS && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  </QueryClientProvider>
);

if (process.env.REACT_APP_GROWTHBOOK_API_KEY) {
  const growthbook = new GrowthBook({
    apiHost: 'https://cdn.growthbook.io',
    clientKey: process.env.REACT_APP_GROWTHBOOK_API_KEY,
    enableDevMode: process.env.NODE_ENV === 'development',
    backgroundSync: false,
    attributes: {
      loggedIn: false,
    },
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

  growthbook.loadFeatures({
    timeout: 4000,
  });

  wrappedApp = <GrowthBookProvider growthbook={growthbook}>{wrappedApp}</GrowthBookProvider>;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(wrappedApp);

// Measure performance Learn more: https://bit.ly/CRA-vitals
// ToDo: Analyze if this is worth using
// reportWebVitals(process.env.NODE_ENV === 'development' ? console.log : undefined);
