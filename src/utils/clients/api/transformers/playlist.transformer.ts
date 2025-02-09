import type { Playlist } from 'utils/types/playlist';
import { Track } from 'utils/types/track';

function trackTransformer(raw: any): Partial<Track> {
  return {
    title: raw?.title,
    artist: raw?.artist,
    duration: parseInt(raw?.duration) || 0,
  };
}

export function playlistTransformer(raw: any): Playlist {
  return {
    uuid: raw?.playlist?.uuid || null,
    name: raw?.playlist?.name || '',
    tracks: (raw?.playlist?.tracks || []).map(trackTransformer),
  };
}
