import get from 'lodash/get';
import { sanitizeArtistName } from './common/sanitizeArtistName';

export function topAlbumsTransformer(response: any) {
  return get(response, 'data.releases', [])
    .map((album) => ({
      artist: sanitizeArtistName(album.artist),
      discogsId: `${album.type === 'master' ? '' : 'release-'}${album.master_id || album.id}`,
      name: album.title,
      url: album.resource_url,
      releasedate: album.year,
      cover: {
        sm: album.thumb,
        lg: album.cover_image || '', // only returning thumb at the moment
      },
      coverSizes: {
        sm: 150,
        lg: 500,
      },
    }))
    .filter((album) => {
      return album.discogsId || album.artist;
    });
}
