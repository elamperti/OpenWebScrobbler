import { avatarTransformer } from './avatar.transformer';

import type { Artist } from 'utils/types/artist';

export function artistsSearchTransformer(raw: any): Artist[] {
  const results = raw?.results?.artistmatches?.artist || [];

  return results.map((artist: any) => ({
    name: artist.name,
    mbid: artist.mbid,
    url: artist.url,
    avatar: avatarTransformer(artist.image),
  }));
}
