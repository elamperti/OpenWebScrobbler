import type { QueryKey } from '@tanstack/react-query';

type AlbumCoverSizeSteps = 'sm' | 'lg';

export type AlbumCover = Record<AlbumCoverSizeSteps, string>;

export type AlbumCoverSizes = Record<AlbumCoverSizeSteps, number>;

export type BaseAlbum = {
  artist: string;
  cover: AlbumCover | null;
  coverSizes: AlbumCoverSizes;
  name: string;
  releasedate?: string;
  trackCount?: number;
  url?: string;
  queryKey?: QueryKey;
};

export type LastFmAlbum = BaseAlbum & {
  mbid: string;
};

export type DiscogsAlbum = BaseAlbum & {
  discogsId: string;
  artistId: string | null;
};

export type Album = DiscogsAlbum | LastFmAlbum;

export type AlbumWithTracks = {
  info: Album;
  tracks: Track[];
};
