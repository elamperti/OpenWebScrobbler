import { coverFromArtId } from './albumSearchResponse.transformer';

import type { QueryKey } from '@tanstack/react-query';
import type { BandcampAlbum } from 'utils/types/album';

export function albumGetInfoTransformer(
  response: any,
  bandId?: string,
  tralbumType?: 'a' | 't',
  tralbumId?: string,
  queryKey?: QueryKey
): BandcampAlbum {
  const data = response?.data || {};
  const artId = data.art_id;
  // release_date is unix seconds
  const year = data.release_date ? String(new Date(data.release_date * 1000).getFullYear()) : undefined;

  return {
    bandId: bandId || '',
    tralbumId: tralbumId || '',
    tralbumType: tralbumType || 'a',
    name: data.title || '',
    artist: data.tralbum_artist || '',
    releasedate: year && year !== 'NaN' ? year : undefined,
    url: data.bandcamp_url,
    cover: artId ? coverFromArtId(artId) : null,
    coverSizes: artId ? { sm: 350, lg: 700 } : null,
    trackCount: data.tracks?.length ?? 0,
    queryKey,
  };
}
