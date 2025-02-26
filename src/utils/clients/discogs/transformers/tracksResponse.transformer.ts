import { get, hasIn } from 'lodash-es';
import shortid from 'shortid';

import { sanitizeArtistName } from './common/sanitizeArtistName';

import type { Track } from 'utils/types/track';

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
): Track[] {
  if (!Array.isArray(response?.data.tracklist) || response?.data.tracklist.length === 0) {
    return [];
  }

  const albumArtist = get(options, 'artist', '');
  const album = get(options, 'album', '');

  return response?.data.tracklist
    .filter(({ type_: trackType }) => {
      if (!trackType || trackType === 'track' || trackType === 'index') {
        return true;
      }
      return false;
    })
    .map((track) => {
      const transformedTrack = {
        artist: sanitizeArtistName(get(track, 'artists[0].name', options?.artist || '')),
        title: track.title,
        album,
        albumArtist,
        duration: track.duration && _HMSStrToSeconds(track.duration),
        id: shortid.generate(),
        cover: null,
        trackNumber: track.position || null,
      } as Track;

      if (hasIn(options, 'cover')) {
        transformedTrack.cover = options.cover;
      }

      return transformedTrack;
    });
}
