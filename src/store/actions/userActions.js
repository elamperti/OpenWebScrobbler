import { hasIn } from 'lodash-es';

import { USER_LOGGED_OUT } from 'Constants';

import history from 'utils/history';
import { createAlert } from './alertActions';
import { logout } from 'utils/clients/api/methods/logout';

export function logOut(dispatch) {
  return (alertObject) => {
    return logout()
      .then(() => {
        dispatch({
          type: USER_LOGGED_OUT,
        });
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
