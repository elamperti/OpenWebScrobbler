// import localforage from 'localforage';
import axios from 'axios';
// import { setupCache } from 'axios-cache-adapter';
import { AUDIOSCROBBLER_API_URL } from 'Constants';

export const lastfmAPI = axios.create({
  baseURL: AUDIOSCROBBLER_API_URL,
  params: {
    api_key: process.env.REACT_APP_LASTFM_API_KEY,
    format: 'json',
  },
  adapter: undefined /* setupCache({
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    readHeaders: false, // Disregard cache-control headers
    exclude: {
      query: false,
    },
    store: localforage.createInstance({
      driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
      name: 'lastfm-cache',
    }),
    limit: 50, // Max cached requests
    debug: process.env.NODE_ENV === 'development',
  }).adapter */,
});
