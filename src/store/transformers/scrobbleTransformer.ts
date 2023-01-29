export function prepareScrobbles(scrobbles) {
  const artist = [];
  const track = [];
  const album = [];
  const albumArtist = [];
  const timestamp = [];

  // Transform content for OWS API
  for (const scrobble of scrobbles) {
    timestamp.push(new Date(scrobble.timestamp).toISOString());
    artist.push(scrobble.artist);
    track.push(scrobble.title);
    album.push(scrobble.album);
    albumArtist.push(scrobble.albumArtist);
  }

  return {
    artist,
    track,
    album,
    albumArtist,
    timestamp,
  };
}
