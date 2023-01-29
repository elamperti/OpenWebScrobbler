import get from 'lodash/get';
import { sanitizeArtistName } from './common/sanitize-artist-name';

export function albumGetInfoTransformer(response: any) {
  if (response?.data.message) {
    return {};
  }

  const images = get(response, 'data.images', []);
  let image = images.find((image) => image.type === 'primary') || null;
  if (!image) {
    image = images.find((image) => image.type === 'secondary') || null;
  }

  return {
    name: response?.data.title,
    artist: sanitizeArtistName(get(response, 'data.artists[0].name', '')), // + response.artists.length > 1 ? '+' : ''
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
  };
}
