import { openscrobblerAPI } from '../apiClient';

export function logout(): Promise<Boolean> {
  return openscrobblerAPI.post('/logout.php').then(({ data }) => data?.status === 'ok');
}
