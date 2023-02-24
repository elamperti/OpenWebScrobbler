import { lastfmAPI } from '../apiClient';
import { searchTopAlbums } from './searchTopAlbums';

jest.mock('../apiClient');

describe('the `searchTopAlbums` function', () => {
  it('should call the API to get the top albums', async() => {
    await searchTopAlbums({ mbid: '1', name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        method: 'artist.getTopAlbums',
      }),
    });
  });

  it('should use the mbid of the artist', async() => {
    await searchTopAlbums({ mbid: '1', name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        mbid: '1',
      }),
    });
  });

  it('should use the artist name in the absence of an mbid', async() => {
    await searchTopAlbums({ name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        artist: 'test',
      }),
    });
  });

  it('should ignore the case on the artist name', async() => {
    await searchTopAlbums({ name: 'TeSt' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        artist: 'test',
      }),
    });
  });
});
