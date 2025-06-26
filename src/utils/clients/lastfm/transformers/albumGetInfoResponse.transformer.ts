import type { QueryKey } from '@tanstack/react-query';
import type { Album } from 'utils/types/album';

export function albumGetInfoTransformer(response: any, mbid?: string, queryKey?: QueryKey): Album | null {
  const album = response?.data?.album;

  if (!album) return null;

  return {
    mbid: mbid || album.mbid,
    name: album.name,
    artist: album.artist,
    releasedate: album.releasedate,
    url: album.url,
    cover: {
      sm: album.image?.[2]?.['#text'],
      lg: album.image?.[3]?.['#text'],
    },
    coverSizes: {
      sm: 174,
      lg: 300,
    },
    trackCount: album.tracks?.track?.length ?? 0,
    queryKey,
  };
}
