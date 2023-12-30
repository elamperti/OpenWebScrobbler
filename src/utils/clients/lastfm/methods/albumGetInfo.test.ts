import { lastfmAPI } from '../apiClient';
import { albumGetInfo } from './albumGetInfo';

vi.mock('../apiClient');

describe('Last.fm client: `albumGetInfo` method', () => {
  it('calls the API to get the album info', async() => {
    await albumGetInfo({ mbid: '1', artist: 'test-artist', name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        method: 'album.getInfo',
      }),
    });
  });

  it('uses the mbid of the album', async() => {
    await albumGetInfo({ mbid: '1', artist: 'test-artist', name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        mbid: '1',
      }),
    });
  });

  it('uses the album and artist name in absence of an mbid', async() => {
    await albumGetInfo({ artist: 'test-artist', name: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        artist: 'test-artist',
        album: 'test',
      }),
    });
  });
});
