import { setlistfmAPI } from 'utils/clients/setlistfm/apiClient';

export async function _setlistfmFindSetlist(setlistId) {
  const { data } = await setlistfmAPI.get('', {
    params: {
      setlist_id: setlistId,
    },
  });

  if (data.setlist.sets && data.setlist.sets.length() > 0) {
    return data.setlist.sets[0].set;
  }
}
