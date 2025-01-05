import axios from 'axios';
import { OPENSCROBBLER_API_URL } from 'Constants';

export const openscrobblerAPI = axios.create({
  baseURL: OPENSCROBBLER_API_URL,
  headers: {
    'OWS-Version': process.env.REACT_APP_VERSION || '',
  },
  validateStatus: (statusCode: number) => {
    if (statusCode === 503) return true;
    return statusCode >= 200 && statusCode < 300;
  },
});
