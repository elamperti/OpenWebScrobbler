import get from 'lodash/get';
import hasIn from 'lodash/hasIn';
import shortid from 'shortid';
import { sanitizeArtistName } from './common/sanitizeArtistName';

/*
  This function takes a [[HH:]MM:]SS string (e.g. "1:03:55") and converts it
  to seconds (e.g. 3785). It does so by spliting by `:` and reversing the str
  so it always has seconds on [0], minutes on [1] and hours on [2]. It avoids
  solving powers of 60 hundreds of times by using a simple lookup table.
 */
const powersOf60LUT = [1, 60, 3600];
function _HMSStrToSeconds(str) {
  // prettier-ignore
  return str ? str.split(':', 3).reverse().reduce((acc, n, i) => acc + n * powersOf60LUT[i], 0) : 30;
}

export function tracksTransformer(
  response: any,
  options?: {
    album: string;
    artist: string;
    cover?: { sm: string; lg: string };
  }
) {
  if (!Array.isArray(response?.data.tracklist) || response?.data.tracklist.length === 0) {
    return [];
  }

  return response?.data.tracklist
    .filter(({ type_: trackType }) => (trackType ? trackType === 'track' : true))
    .map((track) => {
      const transformedTrack = {
        artist: sanitizeArtistName(get(track, 'artists[0].name', options?.artist || '')),
        title: track.title,
        album: get(options, 'album'),
        albumArtist: sanitizeArtistName(get(options, 'artist', '')),
        duration: track.duration && _HMSStrToSeconds(track.duration),
        uuid: shortid.generate(),
        cover: null,
      };

      if (hasIn(options, 'cover')) {
        transformedTrack.cover = options.cover;
      }

      return transformedTrack;
    });
}
