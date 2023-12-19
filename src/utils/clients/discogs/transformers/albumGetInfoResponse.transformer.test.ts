import { albumGetInfoTransformer } from './albumGetInfoResponse.transformer';

describe('Discogs transformer: album info', () => {
  it('should return an empty object if there was a problem retrieving the name', () => {
    expect(albumGetInfoTransformer({ data: { message: 'Error ' } })).toEqual({});
  });

  describe('should format the images', () => {
    it('should use the primary image if exists', () => {
      const results = albumGetInfoTransformer({
        data: {
          images: [
            {
              type: 'primary',
              width: 200,
              uri150: 'example.com/thumb',
              resource_url: 'example.com/cover',
            },
          ],
        },
      });

      expect(results).toEqual(
        expect.objectContaining({
          cover: {
            sm: 'example.com/thumb',
            lg: 'example.com/cover',
          },
          coverSizes: {
            sm: 150,
            lg: 200,
          },
        })
      );
    });

    it('should use the secondary image in absence of the primary', () => {
      const results = albumGetInfoTransformer({
        data: {
          images: [
            {
              type: 'secondary',
              width: 200,
              uri150: 'example.com/thumb',
              resource_url: 'example.com/cover',
            },
          ],
        },
      });

      expect(results).toEqual(
        expect.objectContaining({
          cover: {
            sm: 'example.com/thumb',
            lg: 'example.com/cover',
          },
          coverSizes: {
            sm: 150,
            lg: 200,
          },
        })
      );
    });

    it('should return null in case of no images', () => {
      const results = albumGetInfoTransformer({
        data: {
          images: [],
        },
      });

      expect(results).toEqual(
        expect.objectContaining({
          cover: null,
          coverSizes: null,
        })
      );
    });
  });

  it('should format the album info', () => {
    const results = albumGetInfoTransformer({
      data: {
        title: 'title',
        artists: [
          {
            name: 'artist',
          },
        ],
        year: '2021',
      },
    });

    expect(results).toEqual({
      discogsId: undefined,
      name: 'title',
      artist: 'artist',
      artistId: null,
      releasedate: '2021',
      url: '',
      cover: null,
      coverSizes: null,
      trackCount: 0,
    });
  });

  it('should sanitize artist name', () => {
    const results = albumGetInfoTransformer({
      data: {
        title: 'title',
        artists: [
          {
            name: 'artist (123)',
          },
        ],
        year: '2021',
      },
    });

    expect(results).toEqual(
      expect.objectContaining({
        artist: 'artist',
      })
    );
  });

  it('should replace artist Various with Various artists', () => {
    const results = albumGetInfoTransformer({
      data: {
        title: 'title',
        artists: [
          {
            name: 'Various (123)',
          },
        ],
        year: '2021',
      },
    });

    expect(results).toEqual(
      expect.objectContaining({
        artist: 'Various Artists',
      })
    );
  });
});
