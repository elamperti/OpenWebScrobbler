import { bandcampAPI } from '../apiClient';
import { albumSearch } from './albumSearch';

vi.mock('../apiClient');

describe('Bandcamp client: `albumSearch` method', () => {
  it('calls the API with the given search term', async () => {
    await albumSearch('search-term');

    expect(bandcampAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'album.search',
        q: 'search-term',
      },
    });
  });

  it('ignores the case of the search term', async () => {
    await albumSearch('SEARCH-term');

    expect(bandcampAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        q: 'search-term',
      }),
    });
  });

  it('includes tracks when requested', async () => {
    await albumSearch('search-term', true);

    expect(bandcampAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        include_tracks: 1,
      }),
    });
  });
});
