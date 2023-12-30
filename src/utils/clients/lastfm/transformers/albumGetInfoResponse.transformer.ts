import get from 'lodash/get';

import type { Album } from 'utils/types/album';

export function albumGetInfoTransformer(response: any, mbid?: string): Album | null {
  const album = response?.data?.album;

  if (!album) return null;

  return {
    mbid: mbid || album.mbid,
    name: album.name,
    artist: album.artist,
    releasedate: album.releasedate,
    url: album.url,
    cover: {
      sm: get(album, 'image[2][#text]'),
      lg: get(album, 'image[3][#text]'),
    },
    coverSizes: {
      sm: 174,
      lg: 300,
    },
    trackCount: get(album, 'tracks.track.length', 0),
  };
}
