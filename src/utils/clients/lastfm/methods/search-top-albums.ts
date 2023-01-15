import { lastfmAPI } from '../api-client';
import { topAlbumsTransformer } from '../transformers/top-albums-response.transformer';

export async function searchTopAlbums(artist: { mbid?: string; name: string }) {
  const search = artist.mbid
    ? {
        mbid: artist.mbid,
      }
    : {
        artist: artist.name.toLowerCase(), // dedupes case-sensitive cached queries
      };

  const response = await lastfmAPI.get('', {
    params: {
      method: 'artist.getTopAlbums',
      ...search,
    },
  });

  return topAlbumsTransformer(response);
}
