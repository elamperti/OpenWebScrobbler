import { topAlbumsTransformer } from './topAlbumsResponse.transformer';

describe('the `topAlbumsTransformer` function', () => {
  it('should format the results', () => {
    const results = topAlbumsTransformer({
      data: {
        releases: [
          {
            master_id: '1',
            artist: 'artist',
            type: 'master',
            title: 'title',
            year: '2022',
            resource_url: 'example.com/resource',
            thumb: 'example.com/thumb',
            cover_image: 'example.com/cover',
          },
        ],
      },
    });

    expect(results).toEqual([
      {
        artist: 'artist',
        cover: {
          lg: 'example.com/cover',
          sm: 'example.com/thumb',
        },
        coverSizes: {
          lg: 500,
          sm: 150,
        },
        url: 'example.com/resource',
        name: 'title',
        discogsId: '1',
        releasedate: '2022',
      },
    ]);
  });

  it('should sanitize artist name', () => {
    const results = topAlbumsTransformer({
      data: {
        releases: [
          {
            master_id: '1',
            artist: 'artist (9999)',
            type: 'master',
            title: 'title',
            year: '2022',
            resource_url: 'example.com/resource',
            thumb: 'example.com/thumb',
            cover_image: 'example.com/cover',
          },
        ],
      },
    });

    expect(results).toEqual([
      expect.objectContaining({
        artist: 'artist',
      }),
    ]);
  });

  it('should use the album id in case of absence of the master_id', () => {
    const results = topAlbumsTransformer({
      data: {
        releases: [
          {
            id: '2',
            artist: 'artist',
            type: 'master',
            title: 'title',
            year: '2022',
            resource_url: 'example.com/resource',
            thumb: 'example.com/thumb',
            cover_image: 'example.com/cover',
          },
        ],
      },
    });

    expect(results).toEqual([
      expect.objectContaining({
        discogsId: '2',
      }),
    ]);
  });

  it('should set the `discogsId` based on the album type', () => {
    const results = topAlbumsTransformer({
      data: {
        releases: [
          {
            master_id: '1',
            artist: 'artist',
            type: 'release',
            title: 'title',
            year: '2022',
            resource_url: 'example.com/resource',
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

  it.skip('should filter out releases with no artist or discogsId', () => {
    // FIXME: Bug: in this case the discogsId becomes 'undefined' (string)
    const results = topAlbumsTransformer({
      data: {
        releases: [
          {
            master_id: '',
            artist: '',
            type: 'master',
            title: 'title',
            year: '2022',
          },
        ],
      },
    });

    expect(results.length).toBe(0);
  });
});
