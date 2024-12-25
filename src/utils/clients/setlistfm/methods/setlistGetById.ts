import { setlistfmAPI } from 'utils/clients/setlistfm/apiClient';
import { setlistTransformer } from '../transformers/setlist.transformer';

export async function getSetlistById(setlistId) {
  const { data } = await setlistfmAPI.get('', {
    params: {
      setlistId,
    },
  });

  return setlistTransformer(data, true);
}
