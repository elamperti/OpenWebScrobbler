import { bandcampAPI } from '../apiClient';
import { albumGetInfoTransformer } from '../transformers/albumGetInfoResponse.transformer';
import { tracksTransformer } from '../transformers/tracksResponse.transformer';

import type { QueryKey } from '@tanstack/react-query';
import type { AlbumWithTracks } from 'utils/types/album';

export async function albumGetInfo(
  bandId: string,
  tralbumType: 'a' | 't',
  tralbumId: string,
  queryKey: QueryKey
): Promise<AlbumWithTracks> {
  const response = await bandcampAPI.get('', {
    params: {
      method: 'album.getInfo',
      band_id: bandId,
      tralbum_type: tralbumType,
      tralbum_id: tralbumId,
    },
  });

  const info = albumGetInfoTransformer(response, bandId, tralbumType, tralbumId, queryKey);

  return {
    info,
    tracks: tracksTransformer(response, {
      artist: info.artist,
      album: info.name,
      cover: info.cover,
    }),
  };
}
