import axios from 'axios';
import { DISCOGS_API_URL } from 'Constants';

export const discogsAPI = axios.create({
  baseURL: DISCOGS_API_URL,
  headers: {
    'User-Agent': `OpenScrobbler/${process.env.REACT_APP_VERSION} +https://${process.env.REACT_APP_HOST}`,
  },
  adapter: undefined,
});
