import { discogsAPI } from '../api-client';
import { albumGetInfoTransformer } from '../transformers/album-get-info-response.transformer';
import { tracksTransformer } from '../transformers/tracks-response.transformer';

export async function albumGetInfo(discogsId: string) {
  const response = await discogsAPI.get('', {
    params: {
      method: 'album.getInfo',
      album_id: discogsId,
    },
  });

  const info = albumGetInfoTransformer(response);

  return {
    info,
    tracks: tracksTransformer(response, {
      artist: info.artist,
      album: info.name,
      cover: info.cover,
    }),
  };
}
