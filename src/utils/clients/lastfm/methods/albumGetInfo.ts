import { lastfmAPI } from '../apiClient';
import { albumGetInfoTransformer } from '../transformers/albumGetInfoResponse.transformer';
import { tracksTransformer } from '../transformers/tracksResponse.transformer';


export async function albumGetInfo(album: { mbid?: string; artist: string; name: string }) {
  const searchParams = album.mbid
    ? {
        mbid: album.mbid,
      }
    : {
        artist: album.artist,
        album: album.name,
      };

  const response = await lastfmAPI.get('', {
    params: {
      method: 'album.getInfo',
      ...searchParams,
    },
  });

  const info = albumGetInfoTransformer(response, album.mbid);

  return {
    info,
    tracks: tracksTransformer(response, {
      album: info?.name || '',
      cover: info?.cover || null,
    }),
  };
}
