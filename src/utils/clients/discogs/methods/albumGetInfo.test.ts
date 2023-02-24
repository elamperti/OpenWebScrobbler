import { discogsAPI } from '../apiClient';
import { albumGetInfo } from './albumGetInfo';

jest.mock('../apiClient');

describe('the `albumGetInfo` function', () => {
  it('should call the API with the given discogs id', async() => {
    await albumGetInfo('1');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'album.getInfo',
        album_id: '1',
      },
    });
  });
});
