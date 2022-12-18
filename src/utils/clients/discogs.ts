import { discogsAPI } from '../adapters';

interface IAlbum {
  type: string;
  id: number;
  master_id?: number;
  title: string;
  year: number;
  thumb: string;
  cover_image: string;
}

export async function albumSearch(album: string, includeReleases?: boolean) {
  const response = await discogsAPI.get('', {
    params: {
      method: 'album.search',
      type: includeReleases ? 'release' : 'master',
      q: album.toLowerCase(), // dedupes case-sensitive cached queries
    },
  });

  const results = response?.data?.results || [];

  return results.map((album: IAlbum) => {
    return {
      artist: '', // It's part of the name, impossible to tell
      discogsId: album.type === 'master' ? album.master_id.toString() : `release-${album.id}`,
      name: album.title,
      url: '',
      releasedate: album.year,
      cover: {
        sm: album.thumb,
        lg: album.cover_image,
      },
      coverSizes: {
        sm: 150,
        lg: 500,
      },
    };
  });
}
