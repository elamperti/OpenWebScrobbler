import { get } from 'lodash-es';
import { lastfmAPI } from '../apiClient';

export async function trackGetInfo(track: { mbid?: string; artist: string; title: string }) {
  const searchParams = track.mbid
    ? {
        mbid: track.mbid,
      }
    : {
        artist: track.artist,
        track: track.title,
      };

  const response = await lastfmAPI.get('', {
    params: {
      method: 'track.getInfo',
      ...searchParams,
    },
  });

  return get(response, 'data.track');
}
