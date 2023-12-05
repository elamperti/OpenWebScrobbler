import { discogsAPI } from '../apiClient';
import { albumGetInfo } from './albumGetInfo';

vi.mock('../apiClient');

describe('the `albumGetInfo` function', () => {
  it('should call the API with the given Discogs ID', async() => {
    await albumGetInfo('1');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'album.getInfo',
        album_id: '1',
      },
    });
  });

  it('should contain the Discogs ID in the response', async() => {
    const response = await albumGetInfo('release-560656');

    expect(response.info.discogsId).toBe('release-560656');
  });
});
