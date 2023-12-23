import ReactGA from 'react-ga-neo';
import md5 from 'md5';
import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

import { USER_LOGGED_OUT, USER_GET_INFO, USER_ADD_RECENT_PROFILE, USER_SAVE_INFO } from 'Constants';

import history from 'utils/history';
import { saveToLocalStorage } from 'localstorage';
import { createAlert } from './alertActions';
import { setSettings } from './settingsActions';
import { openscrobblerAPI } from 'utils/clients/api/apiClient';

export function authUserWithToken(dispatch) {
  return (token) => {
    const params = new URLSearchParams();
    params.append('token', token);

    return openscrobblerAPI
      .post('/callback.php', params)
      .then((response) => {
        if (get(response, 'data.status') === 'ok') {
          getUserInfo(dispatch)();
          history.push('/scrobble/song');
        }
      })
      .catch((response) => {
        dispatch(
          createAlert({
            type: 'danger',
            title: 'loginError.title',
            message: 'loginError.message',
          })
        );
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
    openscrobblerAPI.get('/user.php').then((response) => {
      dispatch({
        type: USER_GET_INFO,
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
    return openscrobblerAPI.post('/logout.php').then(() => {
      dispatch({
        type: USER_LOGGED_OUT,
      });
      ReactGA.set({
        userId: undefined,
      });
      try {
        localStorage.removeItem('hashedUID');
      } catch (err) {
        // pass
      }
      history.push('/');
      dispatch(
        createAlert(
          hasIn(alertObject, 'message')
            ? alertObject
            : {
                type: 'info',
                title: 'logoutInfo.title',
                message: 'logoutInfo.message',
              }
        )
      );
    });
  };
}

export function addRecentUser(user) {
  return {
    type: USER_ADD_RECENT_PROFILE,
    payload: user,
  };
}

export function saveUserInfo(data) {
  return {
    type: USER_SAVE_INFO,
    payload: data,
  };
}
