import { lastfmAPI } from '../apiClient';
import { trackGetInfo } from './trackGetInfo';

vi.mock('../apiClient');

describe('Last.fm client: `trackGetInfo` method', () => {
  it('calls the API to get the track info', async () => {
    await trackGetInfo({ mbid: '1', artist: 'test-artist', title: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        method: 'track.getInfo',
      }),
    });
  });

  it('uses the mbid of the track', async () => {
    await trackGetInfo({ mbid: '1', artist: 'test-artist', title: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        mbid: '1',
      }),
    });
  });

  it('uses the track and artist name in absence of an mbid', async () => {
    await trackGetInfo({ artist: 'test-artist', title: 'test' });

    expect(lastfmAPI.get).toHaveBeenCalledWith('', {
      params: expect.objectContaining({
        artist: 'test-artist',
        track: 'test',
      }),
    });
  });
});
