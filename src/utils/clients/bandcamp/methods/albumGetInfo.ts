import { bandcampAPI } from '../apiClient';
import { albumGetInfoTransformer } from '../transformers/albumGetInfoResponse.transformer';
import { tracksTransformer } from '../transformers/tracksResponse.transformer';

import type { QueryKey } from '@tanstack/react-query';
import type { AlbumWithTracks } from 'utils/types/album';

export async function albumGetInfo(bandcampUrl: string, queryKey: QueryKey): Promise<AlbumWithTracks> {
  const response = await bandcampAPI.get('', {
    params: {
      method: 'album.getInfo',
      album_url: bandcampUrl,
    },
  });

  const info = albumGetInfoTransformer(response, bandcampUrl, queryKey);

  return {
    info,
    tracks: tracksTransformer(response, {
      artist: info.artist,
      album: info.name,
      cover: info.cover,
    }),
  };
}
