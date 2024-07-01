import { lastfmAPI } from '../apiClient';
import { artistsSearchTransformer } from '../transformers/artistsSearchResponse.transformer';


export async function searchArtists(artistName: string) {
  const response = await lastfmAPI.get('', {
    params: {
      method: 'artist.search',
      artist: artistName,
      limit: 12, // Receiving 50 artists was unnecessary
    },
  });

  return artistsSearchTransformer(response.data);
}
