import { setlistfmAPI } from 'utils/clients/setlistfm/apiClient';

export async function setlistSearch(setlistId) {
  const { data } = await setlistfmAPI.get('', {
    params: {
      setlist_id: setlistId,
    },
  });
  return data;
}
