import { setlistfmAPI } from 'utils/clients/setlistfm/apiClient';

export async function _setlistfmFindSetlist(setlistId) {
  const { data } = await setlistfmAPI.get('', {
    params: {
      setlist_id: setlistId,
    },
  });

  if (data.setlist.tracks && data.setlist.tracks.length() > 0) {
    return data.setlist.tracks[0].set;
  }
}
