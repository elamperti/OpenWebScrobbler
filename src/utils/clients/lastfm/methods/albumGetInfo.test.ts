import { lastfmAPI } from '../apiClient';
import { albumGetInfo } from './albumGetInfo';

jest.mock('../apiClient');

describe('the `albumGetInfo` function', () => {
  it('should call the API to get the album info', async() => {
    await albumGetInfo({ mbid: '1', artist: 'test-artist', name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        method: 'album.getInfo',
      }),
    });
  });

  it('should use the mbid of the album', async() => {
    await albumGetInfo({ mbid: '1', artist: 'test-artist', name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        mbid: '1',
      }),
    });
  });

  it('should use the album and artist name in the absence of an mbid', async() => {
    await albumGetInfo({ artist: 'test-artist', name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        artist: 'test-artist',
        album: 'test',
      }),
    });
  });
});
