import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { clearAlerts } from 'store/actions/alertActions';

import AlertItem from './partials/AlertItem';
import type { RootState } from 'store';

export default function AlertZone() {
  const location = useLocation();
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.alerts);

  useEffect(() => {
    if (alerts && alerts.length > 0 && !location.state?.keepAlerts) {
      dispatch(clearAlerts());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, dispatch]);

  if (alerts.length === 0) return null;

  return (
    <div className="AlertZone mt-3">
      {alerts.map((data) => (
        <AlertItem key={data.id} {...data} />
      ))}
    </div>
  );
}
