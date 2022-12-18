import { discogsAPI } from '../adapters';
import * as discogsClient from './discogs';

jest.mock('../adapters');

describe('albumSearch', () => {
  it('should call the album.search API with the given search term', async () => {
    await discogsClient.albumSearch('search-term');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'album.search',
        q: 'search-term',
        type: 'master',
      },
    });
  });

  it('should ignore the case of the term', async () => {
    await discogsClient.albumSearch('SEARCH-term');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        q: 'search-term',
      }),
    });
  });

  it('should set the type of the search to release', async () => {
    await discogsClient.albumSearch('SEARCH-term', true);

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        type: 'release',
      }),
    });
  });

  it('should format the results', async () => {
    (discogsAPI.get as jest.Mock).mockResolvedValue({
      data: {
        results: [
          {
            type: 'master',
            id: 1,
            master_id: 2,
            title: 'title',
            year: '2022',
            thumb: 'images.com/thumb',
            cover_image: 'images.com/cover',
          },
          {
            type: 'release',
            id: 1,
            master_id: 2,
            title: 'title',
            year: '2022',
            thumb: 'images.com/thumb',
            cover_image: 'images.com/cover',
          },
        ],
      },
    });

    const results = await discogsClient.albumSearch('SEARCH-term', true);

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
        releasedate: '2022',
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
        releasedate: '2022',
        url: '',
      },
    ]);
  });
});
