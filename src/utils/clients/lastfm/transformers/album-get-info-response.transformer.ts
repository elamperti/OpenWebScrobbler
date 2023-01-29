import get from 'lodash/get';

export function albumGetInfoTransformer(response: any) {
  const album = get(response, 'data.album', {});
  return {
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
  };
}
