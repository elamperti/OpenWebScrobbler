import { discogsAPI } from '../apiClient';
import { searchTopAlbums } from './searchTopAlbums';

vi.mock('../apiClient');

describe('Discogs client: `searchTopAlbums` method', () => {
  it('calls the API with the given Discogs id', async () => {
    await searchTopAlbums('1');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'artist.getTopAlbums',
        artist_id: '1',
      },
    });
  });
});
