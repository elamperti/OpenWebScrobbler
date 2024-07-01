import { discogsAPI } from '../apiClient';
import { albumGetInfoTransformer } from '../transformers/albumGetInfoResponse.transformer';
import { tracksTransformer } from '../transformers/tracksResponse.transformer';


export async function albumGetInfo(discogsId: string) {
  const response = await discogsAPI.get('', {
    params: {
      method: 'album.getInfo',
      album_id: discogsId,
    },
  });

  const info = albumGetInfoTransformer(response, discogsId);

  return {
    info,
    tracks: tracksTransformer(response, {
      artist: info.artist,
      album: info.name,
      cover: info.cover,
    }),
  };
}
