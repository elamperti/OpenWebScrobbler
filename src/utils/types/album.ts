/* eslint-disable no-unused-vars */

type AlbumCoverSizeSteps = 'sm' | 'lg';

export type AlbumCover = {
  [key in AlbumCoverSizeSteps]: string;
};

export type AlbumCoverSizes = {
  [key in AlbumCoverSizeSteps]: number;
};

export type BaseAlbum = {
  artist: string;
  cover: AlbumCover | null;
  coverSizes: AlbumCoverSizes;
  name: string;
  releasedate?: string;
  trackCount?: number;
  url?: string;
};

export type LastFmAlbum = BaseAlbum & {
  mbid: string;
};

export type DiscogsAlbum = BaseAlbum & {
  discogsId: string;
  artistId: string | null;
};

export type Album = DiscogsAlbum | LastFmAlbum;
