import { discogsAPI } from '../apiClient';
import { albumGetInfo } from './albumGetInfo';

import type { DiscogsAlbum } from 'utils/types/album';

vi.mock('../apiClient');

describe('Discogs client: `albumGetInfo` method', () => {
  it('calls the API with the given Discogs ID', async() => {
    await albumGetInfo('1');

    expect(discogsAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'album.getInfo',
        album_id: '1',
      },
    });
  });

  it('has the Discogs ID in the response', async() => {
    const response = await albumGetInfo('release-560656');

    expect((response.info as DiscogsAlbum).discogsId).toBe('release-560656');
  });
});
