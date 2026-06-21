import type { BandcampArtist } from 'utils/types/artist';

export function artistsSearchTransformer(response: any): BandcampArtist[] {
  const results = response?.data?.auto?.results || [];
  return results
    .filter((r) => r.type === 'b' && r.item_url_root && r.id)
    .map((band) => ({
      name: band.name,
      bandId: band.id ? String(band.id) : '',
      url: band.item_url_root,
      avatar: { sm: band.img, md: band.img, lg: band.img, xl: band.img },
    }));
}
