import { openscrobblerAPIv4 } from '../newApiClient';

import type { Playlist } from 'utils/types/playlist';

export function playlistsCreate(playlist: Playlist) {
  return openscrobblerAPIv4.post('/playlists', playlist);
}
