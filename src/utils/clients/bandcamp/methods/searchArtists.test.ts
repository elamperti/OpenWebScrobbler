import { bandcampAPI } from '../apiClient';
import { searchArtists } from './searchArtists';

vi.mock('../apiClient');

describe('Bandcamp client: `searchArtists` method', () => {
  it('calls the API with the given artist name', async () => {
    await searchArtists('artist-name');

    expect(bandcampAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'artist.search',
        q: 'artist-name',
      },
    });
  });

  it('ignores the case of the artist name', async () => {
    await searchArtists('ARTIST-name');

    expect(bandcampAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        q: 'artist-name',
      }),
    });
  });
});
