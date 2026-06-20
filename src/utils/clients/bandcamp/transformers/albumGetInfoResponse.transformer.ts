import type { QueryKey } from '@tanstack/react-query';
import type { BandcampAlbum } from 'utils/types/album';

const coverFromArtId = (artId: number | string) => ({
  sm: `https://f4.bcbits.com/img/a${artId}_2.jpg`,
  lg: `https://f4.bcbits.com/img/a${artId}_16.jpg`,
});

export function albumGetInfoTransformer(response: any, bandcampId?: string, queryKey?: QueryKey): BandcampAlbum {
  const data = response?.data || {};
  const artId = data.art_id ?? data.current?.art_id;
  // album_release_date like "07 Oct 2007 00:00:00 GMT" → year string
  const year = data.album_release_date ? String(new Date(data.album_release_date).getFullYear()) : undefined;

  return {
    bandcampId,
    name: data.current?.title || '',
    artist: data.artist || '',
    releasedate: year && year !== 'NaN' ? year : undefined,
    url: bandcampId,
    cover: artId ? coverFromArtId(artId) : null,
    coverSizes: artId ? { sm: 350, lg: 700 } : null,
    trackCount: Array.isArray(data.trackinfo) ? data.trackinfo.length : 0,
    queryKey,
  };
}
