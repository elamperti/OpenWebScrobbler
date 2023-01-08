import { lastfmAPI } from '../api-client';
import { albumSearchFormatter } from '../formatters/album-search-response.formatter';

export async function albumSearch(album: string) {
  const response = await lastfmAPI.get('', {
    params: {
      method: 'album.search',
      album: album.toLowerCase(), // dedupes case-sensitive cached queries
    },
  });

  return albumSearchFormatter(response);
}
