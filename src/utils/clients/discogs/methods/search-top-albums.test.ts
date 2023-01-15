import { discogsAPI } from '../api-client';
import { searchTopAlbums } from './search-top-albums';

jest.mock('../api-client');

describe('the `searchTopAlbums` function', () => {
  it('should call the album.search API with the given search term', async () => {
    await searchTopAlbums('1');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'artist.getTopAlbums',
        artist_id: '1',
      },
    });
  });
});
