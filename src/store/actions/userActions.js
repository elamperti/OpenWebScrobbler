import { USER_LOGGED_OUT } from 'Constants';
import { hasIn } from 'lodash-es';
import ReactGA from 'react-ga-neo';
import { openscrobblerAPI } from 'utils/clients/api/apiClient';
import history from 'utils/history';

import { createAlert } from './alertActions';


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
