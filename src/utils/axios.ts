import axios from 'axios';
import { get } from 'lodash-es';
import qs from 'qs';
import ReactGA from 'react-ga-neo';

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { createAlert } from 'store/actions/alertActions';
import { logOut } from 'store/actions/userActions';

import { OPENSCROBBLER_API_URL } from 'Constants';

import type { InternalAxiosRequestConfig } from 'axios';
import type { Alert } from 'components/AlertZone/types';

type DOMHighResTimeStamp = number; // should be available through `dom` but it isn't.

// The types are skipped with eslint because of an error I couldn't fix
// (it's a linting issue, not a TS issue)
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  timing?: {
    start: DOMHighResTimeStamp;
    elapsedTime?: DOMHighResTimeStamp;
  };
}

/*
 * For invalid (ERROR) responses
 */
function axiosErrorHandler(payload, dispatch) {
  const errorNumber = payload ? get(payload, 'data.error', payload.status) : -1;
  let newError: Partial<Alert> = {
    type: 'danger',
    persistent: false,
    title: '',
    message: null,
    rawMessage: null,
  };
  let showErrorNumber = false;

  switch (errorNumber) {
    case 4: // Authentication Failed
      newError.type = 'danger';
      newError.message = 'authFailed';
      break;
    case 6:
      newError.message = 'userNotFound';
      break;
    case 9: // Invalid session key
    case 17: // User must be logged in
      newError.type = 'warning';
      newError.message = 'loginAgain';
      newError.persistent = true;
      showErrorNumber = true;

      if (get(payload, 'config.params.method') !== 'user.getRecentTracks') {
        logOut(dispatch)(newError);
      }
      break;
    case 11: // Service offline
    case 16: // Service temporarily unavailable
      newError.title = 'serviceUnavailable';
      newError.message = 'lastfmUnavailable';
      showErrorNumber = true;
      break;
    case 29: // Rate limit exceeded
      newError.title = 'rateLimitExceeded';
      newError.message = 'rateLimitMessage';
      break;
    case 429: // OWS Rate limit
      newError = {
        persistent: false,
        icon: faExclamationTriangle,
        type: 'warning',
        title: 'slowDown',
        message: 'slowDownMessage',
        category: 'slowDown',
      };
      break;
    case 13: // Invalid method signature supplied
    case 26: // API key suspended
    default:
      newError.title = 'unexpectedError';
      // newError.message = 'unexpectedErrorMessage';
      newError.rawMessage = get(payload, 'data.message', null);
      showErrorNumber = true;
  }

  if (newError.message !== 'loginAgain' && newError.message !== 'userNotFound') {
    dispatch(
      createAlert({
        ...newError,
        errorNumber: showErrorNumber ? errorNumber : undefined,
      })
    );
  }
}

export function interceptAxios(dispatch) {
  /*
   * Intercepts requests
   */
  axios.interceptors.request.use(
    (request: ExtendedAxiosRequestConfig) => {
      request.timing = {
        start: performance.now(),
      };

      // ToDo: transform to form encoding only for last.fm
      if (request.method === 'post') {
        request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        request.data = qs.stringify(request.data); // PHP doesn't understand JSON payloads
      }

      return request;
    },
    (error) => {
      axiosErrorHandler(error.response, dispatch);
      return Promise.reject(error);
    }
  );

  /*
   * Intercepts valid (OK) responses
   */
  axios.interceptors.response.use(
    (response) => {
      const timing = (response.config as ExtendedAxiosRequestConfig)?.timing;

      if (timing) {
        timing.elapsedTime = performance.now() - timing.start;
      }

      // ToDo: improve this match to avoid collisions or problems with future API versions
      if (response.config.url.includes(OPENSCROBBLER_API_URL)) {
        switch (response.status) {
          case 502:
            ReactGA.exception({
              description: 'Bad gateway',
              fatal: false,
            });
            break;
          case 429:
            ReactGA.exception({
              description: 'Rate limit hit',
              fatal: false,
            });
            break;
          case 401:
            ReactGA.exception({
              description: 'Invalid session key',
              fatal: true,
            });
            logOut(dispatch)({
              type: 'warning',
              message: 'loginAgain',
              persistent: true,
              showErrorNumber: true,
              errorNumber: 401,
            });
            break;
          default:
            break;
        }
        if (timing) {
          ReactGA.timing({
            category: 'Client response time',
            variable: response.config.url,
            value: Math.round(timing.elapsedTime),
          });
        }
        if (response.data.error) {
          axiosErrorHandler(response, dispatch);
        }
      }

      return response;
    },
    (error) => {
      axiosErrorHandler(error.response, dispatch);
      return Promise.reject(error.response);
    }
  );
}
