import { bandcampAPI } from '../apiClient';
import { artistGetInfoTransformer } from '../transformers/artistGetInfoResponse.transformer';

import type { BandcampAlbum } from 'utils/types/album';

export async function artistGetInfo(bandId: string): Promise<BandcampAlbum[]> {
  const response = await bandcampAPI.get('', {
    params: {
      method: 'artist.getInfo',
      band_id: bandId,
    },
  });
  return artistGetInfoTransformer(response);
}
