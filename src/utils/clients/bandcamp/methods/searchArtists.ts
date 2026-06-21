import { bandcampAPI } from '../apiClient';
import { artistsSearchTransformer } from '../transformers/artistsSearchResponse.transformer';

export async function searchArtists(artistName: string) {
  const response = await bandcampAPI.get('', {
    params: {
      method: 'artist.search',
      q: artistName.toLowerCase(),
    },
  });

  return artistsSearchTransformer(response);
}
