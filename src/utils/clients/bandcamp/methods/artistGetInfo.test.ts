import { bandcampAPI } from '../apiClient';
import { artistGetInfo } from './artistGetInfo';

vi.mock('../apiClient');

describe('Bandcamp client: `artistGetInfo` method', () => {
  it('calls the API with the artist music page URL', async () => {
    await artistGetInfo('radiohead.bandcamp.com');

    expect(bandcampAPI.get).toHaveBeenCalledWith('', {
      params: {
        method: 'artist.getInfo',
        artist_url: 'https://radiohead.bandcamp.com/music',
      },
    });
  });
});
