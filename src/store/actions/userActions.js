import axios from 'axios';
import createHistory from 'history/createBrowserHistory';
import ReactGA from 'react-ga';
import md5 from 'md5';
import get from 'lodash/get';

import { saveToLocalStorage } from 'localstorage';
import { createAlert } from './alertActions';
import { setSettings } from './settingsActions';

const history = createHistory();
const lastfmAuthURL = `https://www.last.fm/api/auth/?api_key=${process.env.REACT_APP_LASTFM_API_KEY}` +
                      `&cb=${window.location.protocol}//${window.location.host}/`;

export function authUserWithToken(dispatch) {
  return (token, onSuccessCallback=null) => {
    axios.post('/api/v2/callback.php', { token: token })
      .then(response => {
        if (get(response, 'data.status') === 'ok') {
          dispatch({
            type: 'USER_LOGGED_IN'
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
        console.error('Error logging in', response);
      })
  }
}

export function getUserInfo(dispatch) {
  return () => {
    axios.post('/api/v2/user.php')
      .then((response) => {
        dispatch({
          type: 'USER_GET_INFO_FULFILLED',
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

export function logIn(dispatch) {
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
    axios.post('/api/v2/logout.php')
      .then(() => {
        dispatch({
          type: 'USER_LOGGED_OUT'
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

