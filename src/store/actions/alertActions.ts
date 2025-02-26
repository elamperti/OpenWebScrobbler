import { ALERT_CLEAR_ALL, ALERT_CREATE, ALERT_DISMISS } from 'Constants';

import type { Alert } from 'components/AlertZone/types';

export function dismissAlert(alertIdentifier: Partial<Alert>) {
  return {
    type: ALERT_DISMISS,
    payload: alertIdentifier,
  };
}

export function clearAlerts() {
  return {
    type: ALERT_CLEAR_ALL,
  };
}

export function createAlert(newAlert: Partial<Alert>) {
  return {
    type: ALERT_CREATE,
    payload: newAlert,
  };
}
