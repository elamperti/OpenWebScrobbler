import axios from 'axios';
import { BANDCAMP_API_URL } from 'Constants';

export const bandcampAPI = axios.create({
  baseURL: BANDCAMP_API_URL,
  adapter: undefined,
});
