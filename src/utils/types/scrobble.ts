import { AlbumCover } from './album';
import { Track } from './track';


export type Scrobble = Track & {
  uuid?: string; // DEPRECATED - TODO: dedupe
  cover?: AlbumCover;
  scrobbleUUID?: string;
  status: 'pending' | 'queued' | 'success' | 'error' | 'retry';
  errorMessage?: string;
  errorDescription?: string;
  timestamp: Date;
};
