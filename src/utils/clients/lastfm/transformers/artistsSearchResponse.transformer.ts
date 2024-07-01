import type { Artist } from 'utils/types/artist';

import { avatarTransformer } from './avatar.transformer';


export function artistsSearchTransformer(raw: any): Artist[] {
  const results = raw?.results?.artistmatches?.artist || [];

  return results.map((artist: any) => ({
    name: artist.name,
    mbid: artist.mbid,
    url: artist.url,
    avatar: avatarTransformer(artist.image),
  }));
}
