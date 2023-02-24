import { tracksTransformer } from './tracksResponse.transformer';

describe('the `tracksTransformer` function', () => {
  it('should format the results', () => {
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
        uuid: expect.anything(),
        cover: undefined,
      },
    ]);
  });

  it('should add the album name for the tracks', () => {
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

  it('should add the cover details for the tracks', () => {
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
          lg: 'example.com/cover',
          sm: 'example.com/thumb',
        },
      }
    );

    expect(results).toEqual([
      expect.objectContaining({
        cover: {
          lg: 'example.com/cover',
          sm: 'example.com/thumb',
        },
      }),
    ]);
  });
});
