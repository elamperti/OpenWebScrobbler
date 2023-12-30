import { discogsAPI } from '../apiClient';
import { albumSearch } from './albumSearch';

vi.mock('../apiClient');

describe('Discogs client: `albumSearch` method', () => {
  it('calls the API with the given search term', async() => {
    await albumSearch('search-term');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'album.search',
        q: 'search-term',
        type: 'master',
      },
    });
  });

  it('ignores the case of the search term', async() => {
    await albumSearch('SEARCH-term');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        q: 'search-term',
      }),
    });
  });

  it('sets the type of the search to release', async() => {
    await albumSearch('SEARCH-term', true);

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        type: 'release',
      }),
    });
  });
});
