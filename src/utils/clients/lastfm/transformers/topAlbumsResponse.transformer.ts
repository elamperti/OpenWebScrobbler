import type { Album } from 'utils/types/album';

export function topAlbumsTransformer(response: any) {
  const albums: Album[] = [];
  const rawAlbumList = response?.data?.topalbums?.album ?? [];

  for (const album of rawAlbumList) {
    if (album.name === '(null)') continue;
    albums.push({
      artist: album.artist.name,
      mbid: album.mbid,
      name: album.name,
      cover: {
        sm: album.image?.[2]?.['#text'],
        lg: album.image?.[3]?.['#text'],
      },
      coverSizes: {
        sm: 174,
        lg: 300,
      },
    });
  }
  return albums;
}
