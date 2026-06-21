import { bandcampAPI } from '../apiClient';
import { albumGetInfo } from './albumGetInfo';

vi.mock('../apiClient');

describe('Bandcamp client: `albumGetInfo` method', () => {
  it('calls the API with the given Bandcamp URL', async () => {
    await albumGetInfo('https://radiohead.bandcamp.com/album/in-rainbows', ['queryKey']);

    expect(bandcampAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'album.getInfo',
        album_url: 'https://radiohead.bandcamp.com/album/in-rainbows',
      },
    });
  });

  it('has the Bandcamp URL in the response', async () => {
    const response = await albumGetInfo('https://radiohead.bandcamp.com/album/in-rainbows', ['queryKey']);

    expect((response.info as { bandcampId: string }).bandcampId).toBe(
      'https://radiohead.bandcamp.com/album/in-rainbows'
    );
  });
});
