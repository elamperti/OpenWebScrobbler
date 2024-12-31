import { tracksTransformer } from './tracksResponse.transformer';

describe('Last.fm transformer: tracks', () => {
  it('formats the results', () => {
    const results = tracksTransformer({
      data: {
        album: {
          tracks: {
            track: [
              {
                artist: {
                  name: 'artist',
                },
                name: 'track',
                duration: '123',
                '@attr': {
                  rank: '2',
                },
              },
            ],
          },
        },
      },
    });

    expect(results).toEqual([
      {
        artist: 'artist',
        title: 'track',
        album: undefined,
        duration: 123,
        id: expect.anything(),
        cover: undefined,
        trackNumber: 2,
      },
    ]);
  });

  it('adds the album name in each track', () => {
    const results = tracksTransformer(
      {
        data: {
          album: {
            tracks: {
              track: [
                {
                  artist: {
                    name: 'artist',
                  },
                  name: 'track',
                  duration: '123',
                },
              ],
            },
          },
        },
      },
      { album: 'album' }
    );

    expect(results).toEqual([
      expect.objectContaining({
        album: 'album',
      }),
    ]);
  });

  it('adds the cover details for each track', () => {
    const results = tracksTransformer(
      {
        data: {
          album: {
            tracks: {
              track: [
                {
                  artist: {
                    name: 'artist',
                  },
                  name: 'track',
                  duration: '123',
                },
              ],
            },
          },
        },
      },
      {
        cover: {
          lg: 'https://example.com/cover',
          sm: 'https://example.com/thumb',
        },
      }
    );

    expect(results).toEqual([
      expect.objectContaining({
        cover: {
          lg: 'https://example.com/cover',
          sm: 'https://example.com/thumb',
        },
      }),
    ]);
  });
});
