import { discogsAPI } from '../api-client';
import { albumSearch } from './album-search';

jest.mock('../api-client');

it('should call the album.search API with the given search term', async() => {
  await albumSearch('search-term');

  expect(discogsAPI.get).toHaveBeenCalledWith('', {
    params: {
      method: 'album.search',
      q: 'search-term',
      type: 'master',
    },
  });
});

it('should ignore the case of the term', async() => {
  await albumSearch('SEARCH-term');

  expect(discogsAPI.get).toHaveBeenCalledWith('', {
    params: expect.objectContaining({
      q: 'search-term',
    }),
  });
});

it('should set the type of the search to release', async() => {
  await albumSearch('SEARCH-term', true);

  expect(discogsAPI.get).toHaveBeenCalledWith('', {
    params: expect.objectContaining({
      type: 'release',
    }),
  });
});
