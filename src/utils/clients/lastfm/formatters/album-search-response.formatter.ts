import get from 'lodash/get';

interface AlbumResult {
  name: string;
  artist: string;
  mbid: string;
  url: string;
  image: { '#text': string }[];
}

export function albumSearchFormatter(response?: unknown) {
  const albums = [];
  const rawAlbumList = get(response, 'data.results.albummatches.album', []) as AlbumResult[];

  for (const album of rawAlbumList) {
    if (album.name === '(null)') continue;
    albums.push({
      artist: album.artist,
      mbid: album.mbid,
      name: album.name,
      url: album.url, // <--
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
