import type { Scrobble } from 'utils/types/scrobble';

export function prepareScrobbles(scrobbles: Partial<Scrobble>[]) {
  const output = {
    artist: [],
    track: [],
    album: [],
    albumArtist: [],
    timestamp: [],
  };

  // Transform content for OWS API
  for (const scrobble of scrobbles) {
    output.timestamp.push(new Date(scrobble.timestamp).toISOString());
    output.artist.push(scrobble.artist);
    output.track.push(scrobble.title);
    output.album.push(scrobble.album || '');
    output.albumArtist.push(scrobble.albumArtist || '');
  }

  return output;
}
