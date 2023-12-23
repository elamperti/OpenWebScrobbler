import axios from 'axios';
import { OPENSCROBBLER_API_URL } from 'Constants';

export const openscrobblerAPI = axios.create({
  baseURL: OPENSCROBBLER_API_URL,
});
