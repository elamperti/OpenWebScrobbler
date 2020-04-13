import get from 'lodash/get'
import hasIn from 'lodash/hasIn'
import shortid from 'shortid'

export function fetchTracks(rawTrackList, opts) {
  let tracks = []

  for (let track of rawTrackList) {
    let transformedTrack = {
      artist: track.artist.name,
      title: track.name,
      album: get(opts, 'album'),
      duration: track.duration || 1,
      uuid: shortid.generate(),
    }

    if (hasIn(opts, 'cover')) {
      transformedTrack.cover = opts.cover
    }

    tracks.push(transformedTrack)
  }
  return tracks
}
