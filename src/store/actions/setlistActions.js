import { openscrobblerAPI } from 'utils/clients/api/apiClient';

export async function _setlistfmFindSetlist(setlistId) {
  const { data } = await openscrobblerAPI.get('/setlistfm.php', {
    params: {
      setlist_id: setlistId,
    },
  });

  if (data.setlist.tracks && data.setlist.tracks.length > 0) {
    // ToDo: add a transformer here
    return data.setlist.tracks[0].set;
  }
}
