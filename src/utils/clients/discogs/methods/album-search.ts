import { discogsAPI } from '../api-client';
import { albumSearchFormatter } from '../formatters/album-search-response.formatter';

export async function albumSearch(album: string, includeReleases?: boolean) {
  const response = await discogsAPI.get('', {
    params: {
      method: 'album.search',
      type: includeReleases ? 'release' : 'master',
      q: album.toLowerCase(), // dedupes case-sensitive cached queries
    },
  });

  return albumSearchFormatter(response);
}
