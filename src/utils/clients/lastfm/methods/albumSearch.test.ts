import { lastfmAPI } from '../apiClient';
import { albumSearch } from './albumSearch';

jest.mock('../apiClient');

describe('the `albumSearch` function', () => {
  it('should call the API with the given search term', async() => {
    await albumSearch('search-term');

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'album.search',
        album: 'search-term',
      },
    });
  });

  it('should ignore the case of the term', async() => {
    await albumSearch('SEARCH-term');

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        album: 'search-term',
      }),
    });
  });
});
