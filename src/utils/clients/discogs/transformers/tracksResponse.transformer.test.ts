import { tracksTransformer } from './tracksResponse.transformer';

vi.mock('shortid', async () => {
  return {
    default: {
      generate: () => 'fakeShortId',
    },
  };
});

describe('Discogs transformer: tracks response', () => {
  it('returns an empty array with empty tracklist in the response', () => {
    expect(tracksTransformer({ data: {} })).toEqual([]);
  });

  it('only includes proper tracks', () => {
    const results = tracksTransformer({
      data: {
        tracklist: [
          {
            // Should be skipped. Example: https://www.discogs.com/release/25468933-Bo-Burnham-Inside
            type_: 'heading',
          },
          {
            // Should be included. It's the most common type used in Discogs.
            type_: 'track',
            title: 'Bohemian Rhapsody',
          },
          {
            // Should be included. Example: https://www.discogs.com/master/33161-Green-Day-American-Idiot
            type_: 'index',
            title: 'Jesus Of Suburbia',
          },
          {
            // Should be skipped and kept away from your turntable.
            type_: 'banana',
          },
        ],
      },
    });

    expect(results).toHaveLength(2);
    expect(results.find(({ title }) => title === 'Bohemian Rhapsody')).toBeTruthy();
    expect(results.find(({ title }) => title === 'Jesus Of Suburbia')).toBeTruthy();
  });

  it('formats the tracks', () => {
    const results = tracksTransformer(
      {
        data: {
          tracklist: [
            {
              type_: 'track',
              title: 'track',
              duration: '4:19',
            },
          ],
        },
      },
      {
        album: 'album',
        artist: 'artist',
      }
    );

    expect(results).toEqual([
      {
        artist: 'artist',
        albumArtist: 'artist',
        title: 'track',
        album: 'album',
        duration: 259,
        id: 'fakeShortId',
        cover: null,
        trackNumber: null,
      },
    ]);
  });

  it('includes tracks of type index', () => {
    const results = tracksTransformer(
      {
        data: {
          tracklist: [
            {
              position: '',
              type_: 'index',
              title: 'Jesus Of Suburbia',
              duration: '9:08',
              sub_tracks: [
                {
                  position: '2.I',
                  type_: 'track',
                  title: 'Jesus Of Suburbia',
                  duration: '',
                },
                {
                  position: '2.II',
                  type_: 'track',
                  title: 'City Of The Damned',
                  duration: '',
                },
                {
                  position: '2.III',
                  type_: 'track',
                  title: "I Don't Care",
                  duration: '',
                },
                {
                  position: '2.IV',
                  type_: 'track',
                  title: 'Dearly Beloved',
                  duration: '',
                },
                {
                  position: '2.V',
                  type_: 'track',
                  title: 'Tales Of Another Broken Home',
                  duration: '',
                },
              ],
            },
          ],
        },
      },
      {
        album: 'album',
        artist: 'artist',
        cover: {
          sm: 'https://example.com/sm.jpg',
          lg: 'https://example.com/lg.jpg',
        },
      }
    );

    expect(results.length).toBe(1);
  });

  it('adds the cover of the album to the tracks', () => {
    const results = tracksTransformer(
      {
        data: {
          tracklist: [
            {
              type_: 'track',
              title: 'track',
              duration: '4:19',
            },
          ],
        },
      },
      {
        album: 'album',
        artist: 'artist',
        cover: {
          sm: 'https://example.com/sm.jpg',
          lg: 'https://example.com/lg.jpg',
        },
      }
    );

    expect(results).toEqual([
      expect.objectContaining({
        cover: {
          sm: 'https://example.com/sm.jpg',
          lg: 'https://example.com/lg.jpg',
        },
      }),
    ]);
  });

  it('sanitizes artist name', () => {
    const results = tracksTransformer(
      {
        data: {
          tracklist: [
            {
              type_: 'track',
              title: 'track',
              duration: '4:19',
            },
          ],
        },
      },
      {
        album: 'album',
        artist: 'artist (9992)',
      }
    );

    expect(results).toEqual([
      expect.objectContaining({
        artist: 'artist',
      }),
    ]);
  });

  it('uses the track artist if present', () => {
    const results = tracksTransformer(
      {
        data: {
          tracklist: [
            {
              type_: 'track',
              artists: [
                {
                  name: 'someone else (1)',
                },
                {
                  name: 'secondary artist',
                },
              ],
              title: 'track',
              duration: '4:19',
            },
          ],
        },
      },
      {
        album: 'album',
        artist: 'Various',
      }
    );

    expect(results).toEqual([
      expect.objectContaining({
        artist: 'someone else',
        albumArtist: 'Various',
      }),
    ]);
  });
});
