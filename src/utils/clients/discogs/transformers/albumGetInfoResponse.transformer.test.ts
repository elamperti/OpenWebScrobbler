import { albumGetInfoTransformer } from './albumGetInfoResponse.transformer';

describe('Discogs transformer: album info', () => {
  it('returns an empty album if there was a problem retrieving it', () => {
    const results = albumGetInfoTransformer({ data: { message: 'Error ' } });

    expect(results).toEqual({
      artist: '',
      artistId: null,
      cover: null,
      coverSizes: null,
      discogsId: undefined,
      name: '',
      releasedate: undefined,
      trackCount: 0,
      url: '',
    });
  });

  describe('Image formatting', () => {
    it('uses the primary image if exists', () => {
      const results = albumGetInfoTransformer({
        data: {
          images: [
            {
              type: 'primary',
              width: 200,
              uri150: 'https://example.com/thumb',
              resource_url: 'https://example.com/cover',
            },
          ],
        },
      });

      expect(results).toEqual(
        expect.objectContaining({
          cover: {
            sm: 'https://example.com/thumb',
            lg: 'https://example.com/cover',
          },
          coverSizes: {
            sm: 150,
            lg: 200,
          },
        })
      );
    });

    it('uses the secondary image in absence of the primary', () => {
      const results = albumGetInfoTransformer({
        data: {
          images: [
            {
              type: 'secondary',
              width: 200,
              uri150: 'https://example.com/thumb',
              resource_url: 'https://example.com/cover',
            },
          ],
        },
      });

      expect(results).toEqual(
        expect.objectContaining({
          cover: {
            sm: 'https://example.com/thumb',
            lg: 'https://example.com/cover',
          },
          coverSizes: {
            sm: 150,
            lg: 200,
          },
        })
      );
    });

    it('returns null in case of no images', () => {
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

  it('formats the album info', () => {
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

  it('sanitizes the artist name', () => {
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

  it("replaces artist 'Various' with 'Various artists'", () => {
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

  it('only returns a valid release year', () => {
    const results = albumGetInfoTransformer({
      data: {
        title: 'title',
        artists: [
          {
            name: 'artist',
          },
        ],
        year: '0',
      },
    });

    expect(results.releasedate).toBeUndefined();
  });
});
