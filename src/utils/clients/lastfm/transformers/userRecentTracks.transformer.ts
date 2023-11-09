import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

export function userRecentTracksTransformer(response: any) {
  const tracks = [];
  if (hasIn(response, 'data.recenttracks.track')) {
    for (const item of get(response, 'data.recenttracks.track', [])) {
      if (!get(item, '[@attr].nowplaying', false)) {
        tracks.push({
          artist: item.artist['#text'],
          title: item.name,
          album: item.album['#text'],
          albumArtist: null,
          timestamp: new Date(item.date.uts * 1000),
        });
      }
    }
  }

  return {
    username: get(response, 'data.recenttracks[@attr].user', ''),
    totalPages: get(response, 'data.recenttracks[@attr].totalPages', ''),
    scrobbles: tracks.reverse(),
  };
}
