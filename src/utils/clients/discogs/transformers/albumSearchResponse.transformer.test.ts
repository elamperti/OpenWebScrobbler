import { albumSearchTransformer } from './albumSearchResponse.transformer';

describe('Discogs transformer: album search', () => {
  it('formats the results', () => {
    const results = albumSearchTransformer({
      data: {
        results: [
          {
            type: 'master',
            id: 1,
            master_id: 2,
            title: 'title',
            year: 2022,
            thumb: 'https://example.com/thumb',
            cover_image: 'https://example.com/cover',
          },
        ],
      },
    });

    expect(results).toEqual([
      {
        artist: '',
        cover: {
          lg: 'https://example.com/cover',
          sm: 'https://example.com/thumb',
        },
        coverSizes: {
          lg: 500,
          sm: 150,
        },
        discogsId: '2',
        name: 'title',
        releasedate: 2022,
        url: 'https://www.discogs.com/master/1',
      },
    ]);
  });

  it('composes a `discogsId` based on the album type', () => {
    const results = albumSearchTransformer({
      data: {
        results: [
          {
            type: 'release',
            id: 1,
            master_id: 2,
            title: 'title',
            year: 2022,
            thumb: 'https://example.com/thumb',
            cover_image: 'https://example.com/cover',
          },
        ],
      },
    });

    expect(results).toEqual([
      expect.objectContaining({
        discogsId: 'release-1',
      }),
    ]);
  });

  it('filters out releases with no artist or Discogs id', () => {
    const results = albumSearchTransformer({
      data: {
        results: [
          {
            type: 'master',
            master_id: '',
            title: 'title',
            year: 2022,
            thumb: 'https://example.com/thumb',
            cover_image: 'https://example.com/cover',
          },
        ],
      },
    });

    expect(results.length).toBe(0);
  });
});
