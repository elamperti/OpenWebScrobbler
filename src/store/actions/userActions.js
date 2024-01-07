import ReactGA from 'react-ga-neo';
import { get, hasIn } from 'lodash-es';

import { USER_LOGGED_OUT } from 'Constants';

import history from 'utils/history';
import { createAlert } from './alertActions';
import { openscrobblerAPI } from 'utils/clients/api/apiClient';

export function authUserWithToken(dispatch) {
  return (token) => {
    const params = new URLSearchParams();
    params.append('token', token);

    return openscrobblerAPI
      .post('/callback.php', params)
      .then((response) => {
        if (get(response, 'data.status') === 'ok') {
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

export function logOut(dispatch) {
  return (alertObject) => {
    ReactGA.event({
      category: 'Session',
      action: 'Logout',
      label: 'Intent',
    }); // ToDo: add nonInteraction prop when logout is not manual
    return openscrobblerAPI
      .post('/logout.php')
      .then(() => {
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
      })
      .catch(() =>
        dispatch(
          createAlert({
            type: 'warning',
            title: 'logoutInfo.title',
            rawMessage: 'There was an error communicating with the server but you have been successfully logged out.',
          })
        )
      );
  };
}
