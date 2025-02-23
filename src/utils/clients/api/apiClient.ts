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

openscrobblerAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
