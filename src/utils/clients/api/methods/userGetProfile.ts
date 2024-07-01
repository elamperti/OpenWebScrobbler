import { openscrobblerAPI } from '../apiClient';
import { userTransformer } from '../transformers/user.transformer';


export function userGetProfile() {
  return openscrobblerAPI.get('/user.php').then(({ data }) => userTransformer(data));
}
