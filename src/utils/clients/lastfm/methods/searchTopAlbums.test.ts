import { searchTopAlbums } from './searchTopAlbums';
import { lastfmAPI } from '../apiClient';


vi.mock('../apiClient');

describe('Last.fm transformer: top albums', () => {
  it('calls the API to get the top albums', async() => {
    await searchTopAlbums({ mbid: '1', name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        method: 'artist.getTopAlbums',
      }),
    });
  });

  it('uses the mbid of the artist', async() => {
    await searchTopAlbums({ mbid: '1', name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        mbid: '1',
      }),
    });
  });

  it('uses the artist name in absence of an mbid', async() => {
    await searchTopAlbums({ name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        artist: 'test',
      }),
    });
  });

  it('ignores the case on the artist name', async() => {
    await searchTopAlbums({ name: 'TeSt' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        artist: 'test',
      }),
    });
  });
});
