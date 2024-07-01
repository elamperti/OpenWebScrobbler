import { discogsAPI } from '../apiClient';
import { albumSearchTransformer } from '../transformers/albumSearchResponse.transformer';


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
