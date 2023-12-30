import { lastfmAPI } from '../apiClient';
import { albumSearch } from './albumSearch';

vi.mock('../apiClient');

describe('Last.fm client: `albumSearch` method', () => {
  it('calls the API with the given search term', async() => {
    await albumSearch('search-term');

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'album.search',
        album: 'search-term',
      },
    });
  });

  it('ignores the case of the term', async() => {
    await albumSearch('SEARCH-term');

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        album: 'search-term',
      }),
    });
  });
});
