import type { BandcampAlbum } from 'utils/types/album';

export const coverFromArtId = (artId: number | string) => ({
  sm: `https://f4.bcbits.com/img/a${artId}_2.jpg`,
  lg: `https://f4.bcbits.com/img/a${artId}_16.jpg`,
});

export function albumSearchTransformer(response: any): BandcampAlbum[] {
  const results = response?.data?.auto?.results || [];
  return results
    .filter((r) => r.type === 'a' || r.type === 't') // albums and (optionally) tracks
    .map((album) => ({
      artist: album.band_name || '',
      name: album.name,
      bandId: album.band_id ? String(album.band_id) : '',
      tralbumId: album.id ? String(album.id) : '',
      tralbumType: album.type as 'a' | 't',
      url: `/scrobble/album/view/bc/${album.band_id}/${album.type}/${album.id}`,
      cover: album.art_id ? coverFromArtId(album.art_id) : album.img ? { sm: album.img, lg: album.img } : null,
      coverSizes: { sm: 350, lg: 700 },
    }))
    .filter((album) => album.bandId && album.tralbumId && album.name);
}
