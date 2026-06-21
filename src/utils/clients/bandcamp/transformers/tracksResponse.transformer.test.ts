import { tracksTransformer } from './tracksResponse.transformer';

describe('Bandcamp transformer: tracks', () => {
  it('formats a normal album using the album artist', () => {
    const tracks = tracksTransformer(
      { data: { tracks: [{ track_num: 1, title: 'Bloom', duration: 237.293 }] } },
      { album: 'The King of Limbs', artist: 'Radiohead' }
    );

    expect(tracks).toHaveLength(1);
    expect(tracks[0].artist).toBe('Radiohead');
    expect(tracks[0].title).toBe('Bloom');
    expect(tracks[0].trackNumber).toBe(1);
    expect(tracks[0].duration).toBe(237);
  });

  it('splits "Artist - Title" for compilations', () => {
    const tracks = tracksTransformer(
      {
        data: {
          tracks: [
            { track_num: 1, title: 'Foo - Bar', duration: 100 },
            { track_num: 2, title: 'Baz - Qux', duration: 100 },
          ],
        },
      },
      { album: 'Various', artist: 'Various Artists' }
    );

    expect(tracks[0].artist).toBe('Foo');
    expect(tracks[0].title).toBe('Bar');
  });
});
