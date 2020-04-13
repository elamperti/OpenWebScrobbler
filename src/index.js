import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import 'bootswatch/dist/slate/bootstrap.min.css'

import { Provider as ReduxProvider } from 'react-redux'
import store from './store'

import ReactGA from 'react-ga'
import * as Sentry from '@sentry/browser'

// Avoid proxies that may interfer with the site
if (document.location.host !== process.env.REACT_APP_HOST) {
  // eslint-disable-next-line no-restricted-globals
  parent.window.location.href = `//${process.env.REACT_APP_HOST}/`
}

// Break out of frames
// eslint-disable-next-line no-restricted-globals
if (top.location !== self.location) {
  // eslint-disable-next-line no-restricted-globals
  top.location = self.location.href
}

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    debug: process.env.NODE_ENV === 'development',
    release: process.env.REACT_APP_VERSION,
    environment: process.env.NODE_ENV,
    sanitizeKeys: [/token/],
    ignoreUrls: [
      // Avoid browser extensions reporting errors
      /extensions\//i,
      /^chrome:\/\//i,
    ]
  })
}

if (process.env.REACT_APP_ANALYTICS_CODE) {
  const appVersion = process.env.REACT_APP_VERSION
  let userId
  let clientId

  try {
    userId = localStorage.getItem('hashedUID')
    clientId = localStorage.getItem('GA_LOCAL_STORAGE_KEY')
  } catch (err) {
    let cookieID = document.cookie.match(/PHPSESSID=([^;]*)/)
    if (cookieID) {
      clientId = cookieID[1]
    }
  }

  ReactGA.initialize(process.env.REACT_APP_ANALYTICS_CODE, {
    debug: process.env.NODE_ENV === 'development',
    gaOptions: {
      clientId,
      userId,
    }
  })

  ReactGA.set({
    appName: 'Open Scrobbler',
    appVersion,
  })
}

ReactDOM.render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>,
  document.getElementById('root')
)
registerServiceWorker(store)
