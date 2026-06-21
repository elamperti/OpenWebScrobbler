import { discogsAPI } from '../apiClient';
import { searchArtists } from './searchArtists';

vi.mock('../apiClient');

describe('Discogs client: `searchArtists` method', () => {
  it('calls the API with the given artist name', async () => {
    await searchArtists('artist-name');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'artist.search',
        type: 'artist',
        q: 'artist-name',
      },
    });
  });

  it('ignores the case of the artist name', async () => {
    await searchArtists('ARTIST-name');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        q: 'artist-name',
      }),
    });
  });
});
