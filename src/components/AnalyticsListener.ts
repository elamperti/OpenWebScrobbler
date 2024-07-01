import { useEffect } from 'react';
import ReactGA from 'react-ga-neo';
import { useLocation } from 'react-router-dom';


function sendPageChange(page) {
  ReactGA.send({ hitType: 'pageview', page });
}

function AnalyticsListener() {
  const location = useLocation();

  useEffect(() => {
    sendPageChange(location.pathname);
  }, [location]);

  return null;
}

export default AnalyticsListener;
