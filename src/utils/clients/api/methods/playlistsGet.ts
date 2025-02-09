import { openscrobblerAPIv4 } from '../newApiClient';
import { playlistTransformer } from '../transformers/playlist.transformer';

export function playlistsGet(playlistId: string) {
  console.log('GET PLAYLIST', playlistId);
  return openscrobblerAPIv4.get(`/playlists/${playlistId}`).then((data) => {
    console.log('THEN WAHT', data);
    return playlistTransformer(data);
  });
}
