import axios from 'axios';
import ReactGA from 'react-ga';
import get from 'lodash/get';
import qs from 'qs';

import { logOut } from 'store/actions/userActions';
import { createAlert } from 'store/actions/alertActions';

function axiosErrorHandler(payload, dispatch) {
  const errorNumber = payload ? get(payload, 'data.error', payload.status) : -1;
  const newError = {
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
    case 13: // Invalid method signature supplied
    case 26: // API key suspended
    default:
      newError.title = 'unexpectedError';
      newError.message = 'unexpectedErrorMessage';
      newError.rawMessage = get(payload, 'data.message', null);
      showErrorNumber = true;
  }

  if (newError.message !== 'loginAgain' && newError.message !== 'userNotFound') {
    createAlert(dispatch)({
      ...newError,
      errorNumber: showErrorNumber ? errorNumber : null,
    });
  }
}

export function interceptAxios(dispatch) {
  /*
   * Intercepts requests
   */
  axios.interceptors.request.use(
    (request) => {
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
   * Intercepts responses
   */
  axios.interceptors.response.use(
    (response) => {
      if (response.config && response.config.timing) {
        response.config.timing.elapsedTime = performance.now() - response.config.timing.start;
      }

      // ToDo: improve this match to avoid collisions or problems with future API versions
      if (response.config.url.match(/\/api\/v2\//)) {
        switch (response.status) {
          case 503:
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
        if (response.config.timing) {
          ReactGA.timing({
            category: 'Client response time',
            variable: response.config.url,
            value: Math.round(response.config.timing.elapsedTime),
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
