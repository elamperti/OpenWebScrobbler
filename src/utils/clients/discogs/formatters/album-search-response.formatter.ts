interface AlbumResult {
  type: string;
  id: number;
  master_id?: number;
  title: string;
  year: number;
  thumb: string;
  cover_image: string;
}

export function albumSearchFormatter(response?: { data?: { results?: AlbumResult[] } }) {
  const results = response?.data?.results || [];

  return results.map((album: AlbumResult) => {
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
