import { discogsAPI } from '../apiClient';
import { searchTopAlbums } from './searchTopAlbums';

jest.mock('../apiClient');

describe('the `searchTopAlbums` function', () => {
  it('should call the API with the given discogs id', async() => {
    await searchTopAlbums('1');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'artist.getTopAlbums',
        artist_id: '1',
      },
    });
  });
});
