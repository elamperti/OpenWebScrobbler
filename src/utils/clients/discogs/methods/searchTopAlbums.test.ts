import { searchTopAlbums } from './searchTopAlbums';
import { discogsAPI } from '../apiClient';


vi.mock('../apiClient');

describe('Discogs client: `searchTopAlbums` method', () => {
  it('calls the API with the given Discogs id', async() => {
    await searchTopAlbums('1');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'artist.getTopAlbums',
        artist_id: '1',
      },
    });
  });
});
