import { topAlbumsTransformer } from './topAlbumsResponse.transformer';


describe('Discogs transformer: top albums', () => {
  it('formats the results', () => {
    const results = topAlbumsTransformer({
      data: {
        releases: [
          {
            master_id: '1',
            artist: 'artist',
            type: 'master',
            title: 'title',
            year: '2022',
            resource_url: 'https://example.com/resource',
            thumb: 'https://example.com/thumb',
            cover_image: 'https://example.com/cover',
          },
        ],
      },
    });

    expect(results).toEqual([
      {
        artist: 'artist',
        cover: {
          lg: 'https://example.com/cover',
          sm: 'https://example.com/thumb',
        },
        coverSizes: {
          lg: 500,
          sm: 150,
        },
        url: 'https://example.com/resource',
        name: 'title',
        discogsId: '1',
        releasedate: '2022',
      },
    ]);
  });

  it('sanitizes artist name', () => {
    const results = topAlbumsTransformer({
      data: {
        releases: [
          {
            master_id: '1',
            artist: 'artist (9999)',
            type: 'master',
            title: 'title',
            year: '2022',
            resource_url: 'https://example.com/resource',
            thumb: 'https://example.com/thumb',
            cover_image: 'https://example.com/cover',
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

  it('uses the album id in absence of master_id', () => {
    const results = topAlbumsTransformer({
      data: {
        releases: [
          {
            id: '2',
            artist: 'artist',
            type: 'master',
            title: 'title',
            year: '2022',
            resource_url: 'https://example.com/resource',
            thumb: 'https://example.com/thumb',
            cover_image: 'https://example.com/cover',
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

  it('sets `discogsId` based on the album type', () => {
    const results = topAlbumsTransformer({
      data: {
        releases: [
          {
            master_id: '1',
            artist: 'artist',
            type: 'release',
            title: 'title',
            year: '2022',
            resource_url: 'https://example.com/resource',
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

  it.skip('filters out releases with no artist or discogsId', () => {
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
