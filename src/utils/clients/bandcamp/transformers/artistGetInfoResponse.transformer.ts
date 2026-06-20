import type { BandcampAlbum } from 'utils/types/album';
import { coverFromArtId } from './albumSearchResponse.transformer';
import { MAX_RELEASES_SCRAPED_FROM_ARTIST_BANDCAMP_PAGE } from 'Constants';

// `domain` is the artist host; page_url is usually relative (/album/away-team) but custom
// pages can link absolute external URLs, so only prefix the domain when it's a path.
export function artistGetInfoTransformer(response: any, domain: string): BandcampAlbum[] {
  const releases = response?.data?.releases || [];
  return releases
    .filter((r) => r.page_url && r.title)
    .slice(0, MAX_RELEASES_SCRAPED_FROM_ARTIST_BANDCAMP_PAGE) // add pagination if users need the long tail
    .map((r) => {
      const url = r.page_url.startsWith('http') ? r.page_url : `https://${domain}${r.page_url}`;
      // art_url is a sized image (…/a<artId>_2.jpg); rebuild sm/lg from the art id like the other transformers.
      const artId = r.art_url?.match(/\/a(\d+)_/)?.[1];
      return {
        artist: r.artist || '',
        name: r.title,
        bandcampId: url,
        url,
        cover: artId ? coverFromArtId(artId) : null,
        coverSizes: { sm: 350, lg: 700 },
      };
    });
}
