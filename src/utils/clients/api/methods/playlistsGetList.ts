import { openscrobblerAPIv4 } from '../newApiClient';

export function playlistsGetList() {
  return openscrobblerAPIv4.get('/playlists/all');
}
