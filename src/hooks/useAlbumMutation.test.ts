import { __updateAlbumWithTracks } from './useAlbumMutation';

import type { AlbumWithTracks } from 'utils/types/album';

describe('__updateAlbumWithTracks', () => {
  const baseAlbum: AlbumWithTracks = {
    info: {
      artist: 'Taylor Swift',
      cover: null,
      coverSizes: { sm: 100, lg: 200 },
      name: 'Lover',
      mbid: 'lover-mbid',
    },
    tracks: [
      { title: 'Lover', artist: 'Taylor Swift' },
      { title: 'ME!', artist: 'Taylor Swift ft Brendon Urie' },
      { title: 'The Man', artist: 'Taylor Swift' },
    ],
  };

  it('updates track artists if they match the old album artist', () => {
    const updated: AlbumWithTracks = {
      info: { ...baseAlbum.info, artist: 'Radiohead' },
      tracks: baseAlbum.tracks,
    };
    const result = __updateAlbumWithTracks(baseAlbum, updated);
    expect(result.tracks[0].artist).toBe('Radiohead');
    expect(result.tracks[1].artist).toBe('Taylor Swift ft Brendon Urie');
    expect(result.tracks[2].artist).toBe('Radiohead');
  });

  it('merges album data if oldData exists', () => {
    const updated: AlbumWithTracks = {
      info: { ...baseAlbum.info, name: 'Fearless' },
      tracks: baseAlbum.tracks,
    };
    const result = __updateAlbumWithTracks(baseAlbum, updated);
    expect(result.info.artist).toBe('Taylor Swift');
    expect(result.info.name).toBe('Fearless');
    expect(result.tracks).toBeDefined();
  });
});
