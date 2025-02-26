import type { Track } from './track';

export type Scrobble = Track & {
  scrobbleUUID?: string; // Used to track scrobbled items (i.e. after scrobbling)
  status: 'pending' | 'queued' | 'success' | 'error' | 'retry';
  errorMessage?: string;
  errorDescription?: string;
  timestamp: Date;
};
