import localforage from 'localforage';
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import { DISCOGS_API_URL } from 'Constants';

export const discogsAPI = axios.create({
  baseURL: DISCOGS_API_URL,
  headers: {
    'User-Agent': `OpenScrobbler/${process.env.REACT_APP_VERSION} +https://${process.env.REACT_APP_HOST}`,
  },
  // params: {
  //   key: process.env.REACT_APP_DISCOGS_API_KEY,
  // },
  adapter: setupCache({
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    readHeaders: false, // Disregard cache-control headers
    exclude: {
      query: false,
    },
    store: localforage.createInstance({
      driver: [
        localforage.INDEXEDDB,
        localforage.LOCALSTORAGE,
      ],
      name: 'discogs-cache',
    }),
    limit: 50, // Max cached requests
    debug: process.env.NODE_ENV === 'development',
  }).adapter,
});
