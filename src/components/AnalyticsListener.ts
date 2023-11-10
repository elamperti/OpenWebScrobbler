import { useEffect } from 'react';
import ReactGA from 'react-ga';

import { useLocation } from 'react-router-dom';

function sendPageChange(page) {
  ReactGA.set({ page });
  ReactGA.pageview(page);
}

function AnalyticsListener() {
  const location = useLocation();

  useEffect(() => {
    sendPageChange(location.pathname);
  }, [location]);

  return null;
}

export default AnalyticsListener;
