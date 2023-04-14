import { albumSearchTransformer } from './albumSearchResponse.transformer';

describe('Discogs transformer: album search', () => {
  it('should format the results', () => {
    const results = albumSearchTransformer({
      data: {
        results: [
          {
            type: 'master',
            id: 1,
            master_id: 2,
            title: 'title',
            year: 2022,
            thumb: 'example.com/thumb',
            cover_image: 'example.com/cover',
          },
        ],
      },
    });

    expect(results).toEqual([
      {
        artist: '',
        cover: {
          lg: 'example.com/cover',
          sm: 'example.com/thumb',
        },
        coverSizes: {
          lg: 500,
          sm: 150,
        },
        discogsId: '2',
        name: 'title',
        releasedate: 2022,
        url: '',
      },
    ]);
  });

  it('should set the `discogsId` based on the album type', () => {
    const results = albumSearchTransformer({
      data: {
        results: [
          {
            type: 'release',
            id: 1,
            master_id: 2,
            title: 'title',
            year: 2022,
            thumb: 'example.com/thumb',
            cover_image: 'example.com/cover',
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

  it('should filter out releases with no artist or discogsId', () => {
    const results = albumSearchTransformer({
      data: {
        results: [
          {
            type: 'master',
            master_id: '',
            title: 'title',
            year: 2022,
            thumb: 'example.com/thumb',
            cover_image: 'example.com/cover',
          },
        ],
      },
    });

    expect(results.length).toBe(0);
  });
});
