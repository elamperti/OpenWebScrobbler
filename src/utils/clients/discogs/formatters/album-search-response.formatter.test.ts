import { albumSearchFormatter } from './album-search-response.formatter';

describe('the `albumSearchFormatter` function', () => {
  it('should format the results', () => {
    const results = albumSearchFormatter({
      data: {
        results: [
          {
            type: 'master',
            id: 1,
            master_id: 2,
            title: 'title',
            year: 2022,
            thumb: 'images.com/thumb',
            cover_image: 'images.com/cover',
          },
          {
            type: 'release',
            id: 1,
            master_id: 2,
            title: 'title',
            year: 2022,
            thumb: 'images.com/thumb',
            cover_image: 'images.com/cover',
          },
        ],
      },
    });

    expect(results).toEqual([
      {
        artist: '',
        cover: {
          lg: 'images.com/cover',
          sm: 'images.com/thumb',
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
      {
        artist: '',
        cover: {
          lg: 'images.com/cover',
          sm: 'images.com/thumb',
        },
        coverSizes: {
          lg: 500,
          sm: 150,
        },
        discogsId: 'release-1',
        name: 'title',
        releasedate: 2022,
        url: '',
      },
    ]);
  });
});