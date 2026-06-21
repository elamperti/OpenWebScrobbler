import { bandcampAPI } from '../apiClient';
import { albumGetInfo } from './albumGetInfo';

vi.mock('../apiClient');

describe('Bandcamp client: `albumGetInfo` method', () => {
  it('calls the API with band_id, tralbum_type, tralbum_id', async () => {
    await albumGetInfo('3957198221', 'a', '2162872411', ['queryKey']);

    expect(bandcampAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'album.getInfo',
        band_id: '3957198221',
        tralbum_type: 'a',
        tralbum_id: '2162872411',
      },
    });
  });

  it('carries the ids through to the response info', async () => {
    const response = await albumGetInfo('3957198221', 'a', '2162872411', ['queryKey']);

    expect((response.info as { bandId: string }).bandId).toBe('3957198221');
    expect((response.info as { tralbumId: string }).tralbumId).toBe('2162872411');
    expect((response.info as { tralbumType: string }).tralbumType).toBe('a');
  });
});
