import { lastfmAPI } from '../api-client';
import { albumSearchFormatter as albumSearchTransformer } from '../transformers/album-search-response.transformer';

export async function albumSearch(album: string) {
  const response = await lastfmAPI.get('', {
    params: {
      method: 'album.search',
      album: album.toLowerCase(), // dedupes case-sensitive cached queries
    },
  });

  return albumSearchTransformer(response);
}
