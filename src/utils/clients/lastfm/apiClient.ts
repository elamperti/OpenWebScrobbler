import axios from 'axios';
import { AUDIOSCROBBLER_API_URL } from 'Constants';

export const lastfmAPI = axios.create({
  baseURL: AUDIOSCROBBLER_API_URL,
  params: {
    api_key: process.env.REACT_APP_LASTFM_API_KEY,
    format: 'json',
  },
  adapter: undefined,
});
