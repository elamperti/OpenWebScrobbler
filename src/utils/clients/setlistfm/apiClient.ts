import axios from 'axios';
import { SETLISTFM_API_URL } from 'Constants';

export const setlistfmAPI = axios.create({
  baseURL: SETLISTFM_API_URL,
  params: {
    api_key: process.env.SETLISTFM_API_KEY,
    format: 'json',
  },
  adapter: undefined,
});
