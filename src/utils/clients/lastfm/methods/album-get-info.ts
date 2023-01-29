import { lastfmAPI } from '../api-client';
import { albumGetInfoTransformer } from '../transformers/album-get-info-response.transformer';
import { tracksTransformer } from '../transformers/tracks-response.transformer';

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

  const info = albumGetInfoTransformer(response);

  return {
    info,
    tracks: tracksTransformer(response, {
      album: info.name,
      cover: info.cover,
    }),
  };
}
