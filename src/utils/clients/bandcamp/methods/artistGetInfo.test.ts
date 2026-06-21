import { bandcampAPI } from '../apiClient';
import { artistGetInfo } from './artistGetInfo';

vi.mock('../apiClient');

describe('Bandcamp client: `artistGetInfo` method', () => {
  it('calls the API with band_id', async () => {
    await artistGetInfo('3957198221');

    expect(bandcampAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'artist.getInfo',
        band_id: '3957198221',
      },
    });
  });
});
