import { bandcampAPI } from '../apiClient';
import { artistGetInfoTransformer } from '../transformers/artistGetInfoResponse.transformer';

import type { BandcampAlbum } from 'utils/types/album';

export async function artistGetInfo(domain: string): Promise<BandcampAlbum[]> {
  const response = await bandcampAPI.get('', {
    params: {
      method: 'artist.getInfo',
      artist_url: `https://${domain}/music`,
    },
  });
  return artistGetInfoTransformer(response, domain);
}
