import get from 'lodash/get';
import { sanitizeArtistName } from './common/sanitizeArtistName';
import { Album } from 'utils/types/album';

export function albumGetInfoTransformer(response: any, discogsId?: string): Album {
  if (response?.data.message) {
    return {};
  }

  const images = get(response, 'data.images', []);
  let image = images.find((image) => image.type === 'primary') || null;
  if (!image) {
    image = images.find((image) => image.type === 'secondary') || null;
  }

  let artist = sanitizeArtistName(get(response, 'data.artists[0].name', ''));
  if (artist.toLowerCase() === 'various') {
    artist = 'Various Artists';
  }

  return {
    discogsId,
    name: response?.data.title,
    artist,
    artistId: get(response, 'data.artists[0].id', null),
    releasedate: response?.data.year,
    url: '',
    cover: image && {
      sm: image.uri150,
      lg: image.resource_url,
    },
    coverSizes: image && {
      sm: 150,
      lg: image.width,
    },
    trackCount: get(response, 'data.tracklist.length', 0),
  };
}
