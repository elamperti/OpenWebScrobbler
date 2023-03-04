import axios from 'axios';
import ReactGA from 'react-ga';
import md5 from 'md5';
import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

import {
  AUDIOSCROBBLER_API_URL,
  OPENSCROBBLER_API_URL,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  USER_GET_INFO,
  FETCH_LASTFM_USER_INFO,
  FETCH_LASTFM_USER_HISTORY,
} from 'Constants';

import history from 'utils/history';
import { saveToLocalStorage } from 'localstorage';
import { createAlert } from './alertActions';
import { setSettings } from './settingsActions';

export function authUserWithToken(dispatch) {
  return (token) => {
    axios
      .post(`${OPENSCROBBLER_API_URL}/callback.php`, { token })
      .then((response) => {
        if (get(response, 'data.status') === 'ok') {
          dispatch({
            type: USER_LOGGED_IN,
          });
          getUserInfo(dispatch)();
          history.push('/scrobble/song');
        }
      })
      .catch((response) => {
        createAlert(dispatch)({
          type: 'danger',
          title: 'loginError.title',
          message: 'loginError.message',
        });
        // Avoid issue OPENSCROBBLER-47
        if (response) {
          /* eslint-disable no-console */
          console.error('Error logging in', response);
        }
      });
  };
}

export function getUserInfo(dispatch) {
  return () => {
    axios.post(`${OPENSCROBBLER_API_URL}/user.php`).then((response) => {
      dispatch({
        type: `${USER_GET_INFO}_FULFILLED`,
        payload: response,
      });
      if (response.data.user) {
        const hashedUserId = md5(response.data.user.name);
        ReactGA.set({
          userId: hashedUserId,
        });
        saveToLocalStorage('hashedUID', hashedUserId);
      }
      if (response.data.settings) {
        setSettings(dispatch)(response.data.settings, false);
      }
    });
  };
}

export function logOut(dispatch) {
  return (alertObject) => {
    ReactGA.event({
      category: 'Session',
      action: 'Logout',
      label: 'Intent',
    }); // ToDo: add nonInteraction prop when logout is not manual
    axios.post(`${OPENSCROBBLER_API_URL}/logout.php`).then(() => {
      dispatch({
        type: USER_LOGGED_OUT,
      });
      ReactGA.set({
        userId: undefined,
      });
      localStorage.removeItem('hashedUID');
      history.push('/');
      createAlert(dispatch)(
        hasIn(alertObject, 'message')
          ? alertObject
          : {
              type: 'info',
              title: 'logoutInfo.title',
              message: 'logoutInfo.message',
            }
      );
    });
  };
}

export function fetchLastfmProfileInfo(dispatch) {
  return (username, callback) => {
    const response = dispatch({
      type: FETCH_LASTFM_USER_INFO,
      payload: axios.get(AUDIOSCROBBLER_API_URL, {
        params: {
          method: 'user.getInfo',
          user: username,
          api_key: process.env.REACT_APP_LASTFM_API_KEY,
          format: 'json',
        },
      }),
    });

    if (typeof callback === 'function') {
      response.then((res) => {
        callback(res);
      });
    }
  };
}

export function fetchLastfmProfileHistory(dispatch) {
  return (username, options = {}, callback) => {
    const response = dispatch({
      type: FETCH_LASTFM_USER_HISTORY,
      payload: axios.get(AUDIOSCROBBLER_API_URL, {
        params: {
          method: 'user.getRecentTracks',
          user: username,
          ...options,
          api_key: process.env.REACT_APP_LASTFM_API_KEY,
          format: 'json',
        },
      }),
    });

    if (typeof callback === 'function') {
      response
        .then((res) => {
          callback(res);
        })
        .catch((err) => {
          callback(null, err);
        });
    }
  };
}
