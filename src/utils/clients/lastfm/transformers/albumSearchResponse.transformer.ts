import { get } from 'lodash-es';


export function albumSearchTransformer(response: any) {
  const albums = [];
  const rawAlbumList = get(response, 'data.results.albummatches.album', []);

  for (const album of rawAlbumList) {
    if (album.name === '(null)') continue;
    albums.push({
      artist: album.artist,
      mbid: album.mbid,
      name: album.name,
      url: album.url,
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
