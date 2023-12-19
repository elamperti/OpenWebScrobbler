import { discogsAPI } from 'utils/clients/discogs/apiClient';

export async function _discogsFindBestMatch(album) {
  const { data } = await discogsAPI.get('', {
    params: {
      method: 'album.search',
      type: 'release',
      // toLowerCase dedupes case-sensitive cached queries
      artist: album.artist.toLowerCase(),
      title: album.name.toLowerCase(),
    },
  });

  if (data.results && data.results.length > 0) {
    return data.results[0].master_id || data.results[0].id;
  }
}
