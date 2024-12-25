import { setlistfmAPI } from 'utils/clients/setlistfm/apiClient';
import { setlistSearchTransformer } from '../transformers/setlistSearch.transformer';

export async function searchSetlist(artistName, page) {
  const { data } = await setlistfmAPI.get('', {
    params: {
      artistName,
      page: page > 1 ? page : undefined,
    },
  });
  return setlistSearchTransformer(data);
}
