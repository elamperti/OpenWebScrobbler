import axios from 'axios';
import shortid from 'shortid';

export function enqueueScrobble(dispatch) {
  return (scrobbles=[]) => {
    let artist=[];
    let track=[];
    let album=[];
    let timestamp=[];
    let scrobbleUUID = shortid.generate();

    // Normalize and add metadata
    scrobbles = scrobbles.map((scrobble) => {
      scrobble.id = shortid.generate();

      if (!scrobble.timestamp) {
        scrobble.timestamp = new Date();
      }
      // scrobble.unixTimestamp = Math.trunc((scrobble.timestamp || new Date()).getTime() / 1000);

      if (!scrobble.album) {
        scrobble.album = '';
      }

      if (!scrobble.cover) {
        // ToDo: possible race condition (response arrives before scrobble is added to store)
        dispatch({
          type: "SCROBBLE_COVER_SEARCH",
          payload: axios.get(`https://ws.audioscrobbler.com/2.0/`, {
            params: {
              method: 'track.getInfo',
              api_key: process.env.REACT_APP_LASTFM_API_KEY,
              artist: scrobble.artist,
              track: scrobble.title,
              ows_scrobbleUUID: scrobble.id,
              format: 'json'
            },
          }),
        });
      }

      return scrobble;
    });

    // Enqueue
    dispatch({
      type: "ENQUEUE_NEW",
      payload: {
        scrobbles,
        scrobbleUUID
      }
    });

    // ToDo: split following code so queue can be processed on demand

    // transform content for OWS API
    for (let scrobble of scrobbles) {
      timestamp.push(scrobble.timestamp.toISOString());
      artist.push(scrobble.artist);
      track.push(scrobble.title);
      album.push(scrobble.album);
    };

    // Dispatch axios promise
    dispatch({
      type: "SCROBBLE",
      payload: axios.post(
        `/api/v2/scrobble.php`,
        {
          artist,
          track,
          album,
          timestamp,
        },
        {
          headers: {
            scrobbleUUID,
          },
        }
      ),
    });
  };
}

export function findAlbumCover(dispatch) {
  return (scrobble) => {

  }
}
