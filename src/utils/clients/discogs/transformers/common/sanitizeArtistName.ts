export function sanitizeArtistName(artist: string) {
  if (typeof artist !== 'string') return '';
  return artist.replace(/ \(\d+\)$/, '');
}
