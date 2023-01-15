import { discogsAPI } from '../api-client';
import { topAlbumsTransformer } from '../transformers/top-albums-response.transformer';

export async function searchTopAlbums(discogsId: string) {
  const response = await discogsAPI.get('', {
    params: {
      method: 'artist.getTopAlbums',
      artist_id: discogsId,
    },
  });

  return topAlbumsTransformer(response);
}
