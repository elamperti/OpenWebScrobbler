import { get } from 'lodash-es';
import { sanitizeArtistName } from './common/sanitizeArtistName';
import type { Album } from 'utils/types/album';

export function topAlbumsTransformer(response: any): Album[] {
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
