import { tracksTransformer } from './tracks-response.transformer';

jest.mock('shortid', () => ({
  generate: () => 'fakeShortId',
}));

describe('the `tracksTransformer` function', () => {
  it('should return an empty array with empty tracklist in the response', () => {
    expect(tracksTransformer({ data: {} })).toEqual([]);
  });

  it('should only format tracks', () => {
    const results = tracksTransformer({
      data: {
        tracklist: [
          {
            type_: 'not-a-track',
          },
          {
            type_: 'track',
          },
        ],
      },
    });

    expect(results).toHaveLength(1);
  });

  it('should format the tracks', () => {
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
        title: 'track',
        album: 'album',
        duration: 259,
        uuid: 'fakeShortId',
        cover: null,
      },
    ]);
  });

  it('should add the cover of the album to the tracks', () => {
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
          sm: 'example.com/sm',
          lg: 'example.com/lg',
        },
      }
    );

    expect(results).toEqual([
      expect.objectContaining({
        cover: {
          sm: 'example.com/sm',
          lg: 'example.com/lg',
        },
      }),
    ]);
  });

  it('should sanitize artist name', () => {
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
});
