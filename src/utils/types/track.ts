export type Track = {
  id: string;
  trackNumber: string | number; // This could be things like 'A1'
  artist: string;
  title: string;
  album: string;
  albumArtist: string;
  duration: number; // In seconds
};
