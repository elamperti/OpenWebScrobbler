import type { AlbumCover } from './album';

export type TrackID = string;

export type Track = {
  id: TrackID;
  trackNumber: string | number; // This could be things like 'A1'
  artist: string;
  title: string;
  album: string;
  albumArtist: string;
  cover?: AlbumCover;
  duration: number; // In seconds
};
