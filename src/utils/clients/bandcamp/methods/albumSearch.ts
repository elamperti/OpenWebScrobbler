import { bandcampAPI } from '../apiClient';
import { albumSearchTransformer } from '../transformers/albumSearchResponse.transformer';

export async function albumSearch(album: string, includeTracks = false) {
  const response = await bandcampAPI.get('', {
    params: {
      method: 'album.search',
      q: album.toLowerCase(), // dedupes case-sensitive cached queries
      ...(includeTracks && { include_tracks: 1 }),
    },
  });
  return albumSearchTransformer(response);
}
