import get from 'lodash/get';
import { castArray } from 'utils/common';
import hasIn from 'lodash/hasIn';
import shortid from 'shortid';

export function tracksTransformer(response: any, options?: { album?: string; cover?: { sm: string; lg: string } }) {
  // tracks.track can be either an array of tracks or just a track object (when it's only one track).
  // A consistency only second to that of jelly.
  const rawTrackList = castArray(get(response, 'data.album.tracks.track', []));

  const tracks = [];

  for (const track of rawTrackList) {
    const transformedTrack = {
      artist: track.artist.name,
      title: track.name,
      album: get(options, 'album'),
      duration: track.duration ? parseInt(track.duration) : 0,
      uuid: shortid.generate(),
      cover: undefined,
    };

    if (hasIn(options, 'cover')) {
      transformedTrack.cover = options.cover;
    }

    tracks.push(transformedTrack);
  }
  return tracks;
}
