import { openscrobblerAPI } from 'utils/clients/api/apiClient';
import { setlistSearchTransformer } from '../transformers/setlistSearch.transformer';

export async function searchSetlist(artistName, page) {
  const { data } = await openscrobblerAPI.get('/setlistfm.php', {
    params: {
      artistName,
      page: page > 1 ? page : undefined,
    },
  });
  return setlistSearchTransformer(data);
}
