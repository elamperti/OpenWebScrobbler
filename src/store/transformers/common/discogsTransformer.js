export function sanitizeDiscogsArtistName(artist) {
  return artist.replace(/ \(\d+\)$/, '');
}
