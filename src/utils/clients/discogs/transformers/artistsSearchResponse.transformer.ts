import type { Artist } from 'utils/types/artist';

import { sanitizeArtistName } from './common/sanitizeArtistName';


export function artistsSearchTransformer(raw: any): Artist[] {
  const results = raw?.data?.results || [];

  return results.map((artist: any) => ({
    name: sanitizeArtistName(artist.title),
    discogsId: artist.id,
    url: artist.uri ? `https://www.discogs.com${artist.uri}` : null,
    avatar: {
      sm: artist.thumb,
      md: artist.thumb,
      lg: artist.cover_image,
      xl: artist.cover_image,
    },
  }));
}
