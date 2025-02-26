import type { Avatar } from './avatar';

type BaseArtist = {
  name: string;
  url: string;
  avatar: Avatar;
};

export type LastFmArtist = BaseArtist & {
  mbid: string;
};

export type DiscogsArtist = BaseArtist & {
  discogsId: string;
};

export type Artist = LastFmArtist | DiscogsArtist;
