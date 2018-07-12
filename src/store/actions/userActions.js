import axios from 'axios';
import createHistory from 'history/createBrowserHistory';
import ReactGA from 'react-ga';

import { saveToLocalStorage } from 'localstorage';
import { createAlert } from './alertActions';
import { setSettings } from './settingsActions';

const history = createHistory();
const lastfmAuthURL = `https://www.last.fm/api/auth/?api_key=${process.env.REACT_APP_LASTFM_API_KEY}` +
                      `&cb=${window.location.protocol}//${window.location.host}/`;

export function authUserWithToken(dispatch) {
  return (token) => {
    axios.post('/api/v2/callback.php', { token: token })
      .then(response => {
        if (response.data.status && response.data.status === 'ok') {
          dispatch({
            type: 'USER_LOGGED_IN'
          });
          getUserInfo(dispatch)();
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
          ReactGA.set({
            userId: response.data.user.name
          });
          saveToLocalStorage('userId', response.data.user.name);
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
        localStorage.removeItem('userId');
        history.push('/');
        createAlert(dispatch)({
          type: 'info',
          title: 'logoutInfo.title',
          message: 'logoutInfo.message'
        });
      });
  };
}

