import { openscrobblerAPI } from '../apiClient';

export function logout(): Promise<boolean> {
  return openscrobblerAPI.post('/logout.php').then(({ data }) => data?.status === 'ok');
}
