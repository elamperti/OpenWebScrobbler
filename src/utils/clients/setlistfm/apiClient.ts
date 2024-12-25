import axios from 'axios';
import { OPENSCROBBLER_API_URL } from 'Constants';

export const setlistfmAPI = axios.create({
  baseURL: `${OPENSCROBBLER_API_URL}/setlistfm.php`,
  adapter: undefined,
});
