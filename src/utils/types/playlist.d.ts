import { Track } from './track';

export type Playlist = {
  uuid?: string;
  name: string;
  tracks: Partial<Track>[];
};
