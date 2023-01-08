import { lastfmAPI } from '../api-client';
import { albumSearch } from './album-search';

jest.mock('../api-client');

it('should call the album.search API with the given search term', async() => {
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
