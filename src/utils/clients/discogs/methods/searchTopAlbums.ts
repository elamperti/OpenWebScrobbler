import { discogsAPI } from '../apiClient';
import { topAlbumsTransformer } from '../transformers/topAlbumsResponse.transformer';


export async function searchTopAlbums(discogsId: string) {
  const response = await discogsAPI.get('', {
    params: {
      method: 'artist.getTopAlbums',
      artist_id: discogsId,
    },
  });

  return topAlbumsTransformer(response);
}
