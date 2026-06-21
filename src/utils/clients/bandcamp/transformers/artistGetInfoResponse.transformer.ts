import { coverFromArtId } from './albumSearchResponse.transformer';

import type { BandcampAlbum } from 'utils/types/album';

export function artistGetInfoTransformer(response: any): BandcampAlbum[] {
  const discography = response?.data?.discography || [];
  return discography
    .filter((r) => r.item_id && r.title)
    .map((r) => ({
      artist: r.artist_name || r.band_name || '',
      name: r.title,
      bandId: String(r.band_id),
      tralbumId: String(r.item_id),
      tralbumType: r.item_type === 'track' ? ('t' as const) : ('a' as const),
      url: r.item_url,
      cover: r.art_id ? coverFromArtId(r.art_id) : null,
      coverSizes: { sm: 350, lg: 700 },
    }));
}
