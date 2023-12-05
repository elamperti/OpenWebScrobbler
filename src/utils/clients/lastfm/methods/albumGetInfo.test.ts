import { lastfmAPI } from '../apiClient';
import { albumGetInfo } from './albumGetInfo';

vi.mock('../apiClient');

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

  it('should return the mbid if it was included in the album object', async() => {
    const response = await albumGetInfo({
      mbid: 'bd2fef46-f003-477f-bfb0-6b4de66cfcea',
      artist: 'Avril Lavigne',
      name: 'Let Go',
    });

    expect(response.info.mbid).toBe('bd2fef46-f003-477f-bfb0-6b4de66cfcea');
  });

  it('should return an undefined mbid if not specified in request', async() => {
    const response = await albumGetInfo({
      artist: 'Avril Lavigne',
      name: 'Let Go',
    });

    expect(response.info.mbid).toBeUndefined();
  });
});
