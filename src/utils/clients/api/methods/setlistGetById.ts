import { openscrobblerAPI } from 'utils/clients/api/apiClient';
import { setlistTransformer } from '../transformers/setlist.transformer';

export async function getSetlistById(setlistId) {
  const { data } = await openscrobblerAPI.get('/setlistfm.php', {
    params: {
      setlistId,
    },
  });

  return setlistTransformer(data, true);
}
