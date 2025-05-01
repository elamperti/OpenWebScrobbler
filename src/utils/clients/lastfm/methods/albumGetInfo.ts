import { lastfmAPI } from '../apiClient';
import { albumGetInfoTransformer } from '../transformers/albumGetInfoResponse.transformer';
import { tracksTransformer } from '../transformers/tracksResponse.transformer';

import type { QueryKey } from '@tanstack/react-query';
import type { AlbumWithTracks } from 'utils/types/album';

export async function albumGetInfo(
  album: { mbid?: string; artist: string; name: string },
  queryKey: QueryKey
): Promise<AlbumWithTracks> {
  const searchParams = album.mbid
    ? {
        mbid: album.mbid,
      }
    : {
        artist: album.artist,
        album: album.name,
      };

  const response = await lastfmAPI.get('', {
    params: {
      method: 'album.getInfo',
      ...searchParams,
    },
  });

  const info = albumGetInfoTransformer(response, album.mbid, queryKey);

  return {
    info,
    tracks: tracksTransformer(response, {
      album: info?.name || '',
      cover: info?.cover || null,
    }),
  };
}
