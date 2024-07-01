import { discogsAPI } from '../apiClient';
import { artistsSearchTransformer } from '../transformers/artistsSearchResponse.transformer';


export async function searchArtists(artistName: string) {
  const response = await discogsAPI.get('', {
    params: {
      method: 'artist.search',
      type: 'artist',
      q: artistName.toLowerCase(),
    },
  });

  return artistsSearchTransformer(response);
}
