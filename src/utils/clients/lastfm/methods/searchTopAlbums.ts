import { lastfmAPI } from '../apiClient';
import { topAlbumsTransformer } from '../transformers/topAlbumsResponse.transformer';

export async function searchTopAlbums(artist: { mbid?: string; name: string }) {
  const search = artist.mbid ? { mbid: artist.mbid } : { artist: artist.name.toLowerCase() };

  const response = await lastfmAPI.get('', {
    params: {
      method: 'artist.getTopAlbums',
      ...search,
    },
  });

  return topAlbumsTransformer(response);
}
