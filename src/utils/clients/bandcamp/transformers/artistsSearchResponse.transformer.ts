import type { BandcampArtist } from 'utils/types/artist';

export function artistsSearchTransformer(response: any): BandcampArtist[] {
  const results = response?.data?.auto?.results || [];
  return results
    .filter((r) => r.type === 'b' && r.item_url_root)
    .map((band) => {
      const url = band.item_url_root;
      return {
        name: band.name,
        bandcampDomain: new URL(url).hostname,
        url,
        avatar: { sm: band.img, md: band.img, lg: band.img, xl: band.img },
      };
    });
}
