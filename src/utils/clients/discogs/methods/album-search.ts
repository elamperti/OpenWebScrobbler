import { discogsAPI } from '../api-client';
import { albumSearchTransformer } from '../transformers/album-search-response.transformer';

export async function albumSearch(album: string, includeReleases?: boolean) {
  const response = await discogsAPI.get('', {
    params: {
      method: 'album.search',
      type: includeReleases ? 'release' : 'master',
      q: album.toLowerCase(), // dedupes case-sensitive cached queries
    },
  });

  return albumSearchTransformer(response);
}
