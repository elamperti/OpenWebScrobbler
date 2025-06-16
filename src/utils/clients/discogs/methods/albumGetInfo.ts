import { discogsAPI } from '../apiClient';
import { albumGetInfoTransformer } from '../transformers/albumGetInfoResponse.transformer';
import { tracksTransformer } from '../transformers/tracksResponse.transformer';

import type { QueryKey } from '@tanstack/react-query';
import type { AlbumWithTracks } from 'utils/types/album';

export async function albumGetInfo(discogsId: string, queryKey: QueryKey): Promise<AlbumWithTracks> {
  const response = await discogsAPI.get('', {
    params: {
      method: 'album.getInfo',
      album_id: discogsId,
    },
  });

  const info = albumGetInfoTransformer(response, discogsId, queryKey);

  return {
    info,
    tracks: tracksTransformer(response, {
      artist: info.artist,
      album: info.name,
      cover: info.cover,
    }),
  };
}
