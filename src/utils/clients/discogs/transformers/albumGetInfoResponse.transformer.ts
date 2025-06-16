import { sanitizeArtistName } from './common/sanitizeArtistName';

import type { QueryKey } from '@tanstack/react-query';
import type { Album } from 'utils/types/album';

export function albumGetInfoTransformer(response: any, discogsId?: string, queryKey?: QueryKey): Album {
  const hasArtist = Array.isArray(response?.data?.artists) && response.data.artists.length > 0;
  const images = response?.data?.images || [];

  let image = images.find((image) => image.type === 'primary') || null;
  if (!image) {
    image = images.find((image) => image.type === 'secondary') || null;
  }

  let artist = hasArtist ? sanitizeArtistName(response.data.artists[0].name) : '';
  if (artist.toLowerCase() === 'various') {
    artist = 'Various Artists';
  }

  const albumYear = response?.data?.year || 0;

  return {
    discogsId,
    name: response?.data?.title || '',
    artist,
    artistId: (hasArtist && response.data.artists[0].id) || null,
    releasedate: parseInt(albumYear) > 0 ? albumYear : undefined,
    url: '',
    cover: image && {
      sm: image.uri150,
      lg: image.resource_url,
    },
    coverSizes: image && {
      sm: 150,
      lg: image.width,
    },
    trackCount: response?.data?.tracklist?.length || 0,
    queryKey,
  };
}
