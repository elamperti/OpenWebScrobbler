import axios from 'axios';
import createHistory from 'history/createBrowserHistory';
import ReactGA from 'react-ga';
import md5 from 'md5';
import get from 'lodash/get';

import {
  AUDIOSCROBBLER_API_URL,
  OPENSCROBBLER_API_URL,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  USER_GET_INFO,
  FETCH_LASTFM_USER_INFO,
  FETCH_LASTFM_USER_HISTORY,
} from 'Constants';

import { saveToLocalStorage } from 'localstorage';
import { createAlert } from './alertActions';
import { setSettings } from './settingsActions';

const history = createHistory();
const lastfmAuthURL = `https://www.last.fm/api/auth/?api_key=${process.env.REACT_APP_LASTFM_API_KEY}` +
                      `&cb=${window.location.protocol}//${window.location.host}/`;

export function authUserWithToken(dispatch) {
  return (token, onSuccessCallback=null) => {
    axios.post(`${OPENSCROBBLER_API_URL}/callback.php`, { token: token })
      .then(response => {
        if (get(response, 'data.status') === 'ok') {
          dispatch({
            type: USER_LOGGED_IN
          });
          getUserInfo(dispatch)();
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        }
      })
      .catch(response => {
        createAlert(dispatch)({
          type: 'danger',
          title: 'loginError.title',
          message: 'loginError.message'
        });
        /* eslint-disable no-console */
        console.error('Error logging in', response);
      })
  }
}

export function getUserInfo(dispatch) {
  return () => {
    axios.post(`${OPENSCROBBLER_API_URL}/user.php`)
      .then((response) => {
        dispatch({
          type: `${USER_GET_INFO}_FULFILLED`,
          payload: response
        });
        if (response.data.user) {
          let hashedUserId = md5(response.data.user.name);
          ReactGA.set({
            userId: hashedUserId
          });
          saveToLocalStorage('hashedUID', hashedUserId);
        }
        if (response.data.settings) {
          setSettings(dispatch)(response.data.settings, false);
        }
      });
  }
}

export function logIn(/*dispatch*/) {
  return () => {
    ReactGA.outboundLink({
      label: 'Login intent',
      to: lastfmAuthURL
    }, () => {
      window.location = lastfmAuthURL;
    });
  };
}

export function logOut(dispatch) {
  return () => {
    ReactGA.event({
      category: 'Session',
      action: 'Logout',
      label: 'Intent',
    }); // ToDo: add nonInteraction prop when logout is not manual
    axios.post(`${OPENSCROBBLER_API_URL}/logout.php`)
      .then(() => {
        dispatch({
          type: USER_LOGGED_OUT
        });
        ReactGA.set({
          userId: undefined,
        });
        localStorage.removeItem('hashedUID');
        history.push('/');
        createAlert(dispatch)({
          type: 'info',
          title: 'logoutInfo.title',
          message: 'logoutInfo.message'
        });
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
          format: 'json'
        },
      })
    });

    if (typeof callback === 'function') {
      response.then((res) => {
        callback(res);
      });
    }
  };
}

export function fetchLastfmProfileHistory(dispatch) {
  return (username, options, callback) => {
    const response = dispatch({
      type: FETCH_LASTFM_USER_HISTORY,
      payload: axios.get(AUDIOSCROBBLER_API_URL, {
        params: {
          method: 'user.getRecentTracks',
          user: username,
          api_key: process.env.REACT_APP_LASTFM_API_KEY,
          format: 'json'
        },
      })
    });

    if (typeof callback === 'function') {
      response.then((res) => {
        callback(res);
      });
    }
  };
}
