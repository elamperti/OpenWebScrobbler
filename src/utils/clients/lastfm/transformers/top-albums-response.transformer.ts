import get from 'lodash/get';

export function topAlbumsTransformer(response: any) {
  const albums = [];
  const rawAlbumList = get(response, 'data.results.topalbums.album', []);

  for (const album of rawAlbumList) {
    if (album.name === '(null)') continue;
    albums.push({
      artist: album.artist.name,
      mbid: album.mbid,
      name: album.name,
      cover: {
        sm: get(album, 'image[2][#text]'),
        lg: get(album, 'image[3][#text]'),
      },
      coverSizes: {
        sm: 174,
        lg: 300,
      },
    });
  }
  return albums;
}
