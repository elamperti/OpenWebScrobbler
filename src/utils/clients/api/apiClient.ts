import axios from 'axios';
import { OPENSCROBBLER_API_URL } from 'Constants';

export const openscrobblerAPI = axios.create({
  baseURL: OPENSCROBBLER_API_URL,
  validateStatus: (statusCode: number) => {
    if (statusCode === 503) return true;
    return statusCode >= 200 && statusCode < 300;
  },
});
