import { ALERT_CREATE, ALERT_DISMISS, ALERT_CLEAR_ALL } from 'Constants';

export function dismissAlert(dispatch) {
  return (alertIdentifier) => {
    dispatch({
      type: ALERT_DISMISS,
      payload: alertIdentifier,
    });
  };
}

export function clearAlerts() {
  return {
    type: ALERT_CLEAR_ALL,
  };
}

export function createAlert(dispatch) {
  return (newAlert) => {
    dispatch({
      type: ALERT_CREATE,
      payload: newAlert,
    });
  };
}
