import { lastfmAPI } from '../apiClient';

export async function trackGetInfo(track: { mbid?: string; artist: string; title: string }) {
  const searchParams = track.mbid
    ? {
        mbid: track.mbid,
      }
    : {
        artist: track.artist.trim(),
        track: track.title.trim(),
      };

  const response = await lastfmAPI.get('', {
    params: {
      method: 'track.getInfo',
      ...searchParams,
    },
  });

  return response?.data?.track;
}
