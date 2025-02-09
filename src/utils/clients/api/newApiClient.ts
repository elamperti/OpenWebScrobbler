import axios from 'axios';
import { OPENSCROBBLER_API_V4_URL } from 'Constants';

// Temporal while the old API is deprecated
export const openscrobblerAPIv4 = axios.create({
  baseURL: OPENSCROBBLER_API_V4_URL,
  headers: {
    'OWS-Version': process.env.REACT_APP_VERSION || '',
  },
});

openscrobblerAPIv4.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
