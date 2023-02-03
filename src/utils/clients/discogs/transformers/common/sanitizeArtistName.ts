export function sanitizeArtistName(artist: string) {
  return artist.replace(/ \(\d+\)$/, '');
}
