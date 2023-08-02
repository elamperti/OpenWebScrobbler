import axios from 'axios';
import shortid from 'shortid';

import {
  AUDIOSCROBBLER_API_URL,
  ENQUEUE_NEW,
  FLUSH_QUEUE,
  COUNT_SCROBBLES_ENABLE,
  COUNT_SCROBBLES_DISABLE,
  CLEAR_SCROBBLES_LIST,
  SCROBBLE_COVER_SEARCH,
  SCROBBLING_DEBOUNCE_PERIOD,
} from 'Constants';

export function enqueueScrobble(dispatch) {
  return (scrobbles = []) => {
    // Normalize and add metadata
    scrobbles = scrobbles.map((scrobble, i) => {
      scrobble.id = shortid.generate();
      scrobble.setIndex = i;

      if (!scrobble.timestamp) {
        scrobble.timestamp = new Date();
      }

      if (!scrobble.cover) {
        dispatch({
          // ToDo: queue to avoid sending many reqs together
          type: SCROBBLE_COVER_SEARCH,
          payload: axios.get(AUDIOSCROBBLER_API_URL, {
            params: {
              _uuid: scrobble.id,
              method: scrobble.album ? 'album.getInfo' : 'track.getInfo',
              api_key: process.env.REACT_APP_LASTFM_API_KEY,
              artist: scrobble.artist,
              track: scrobble.title,
              album: scrobble.album || '',
              albumArtist: scrobble.albumArtist,
              format: 'json',
            },
          }),
        });
      }

      return scrobble;
    });

    // Enqueue
    dispatch({
      type: ENQUEUE_NEW,
      payload: {
        scrobbles,
      },
    });

    dispatch({
      type: FLUSH_QUEUE,
      meta: {
        debounce: {
          leading: true,
          time: SCROBBLING_DEBOUNCE_PERIOD,
        },
      },
      payload: { dispatch }, // FIXME: this is an anti-pattern
      /* The thing here is: I need to scrobble *all* queued tracks, but I only want to
       * do so once every SCROBBLING_DEBOUNCE_PERIOD. This is an ugly -but effective-
       * way to trigger on each enqueue call and fire just once.
       *
       * PS: Future me: I'm sorry.
       */
    });
  };
}

export function clearListOfScrobbles(dispatch) {
  return () => {
    dispatch({
      type: CLEAR_SCROBBLES_LIST,
    });
  };
}

export function scrobbleCounterEnabled(dispatch) {
  return (newValue) => {
    dispatch({
      type: newValue ? COUNT_SCROBBLES_ENABLE : COUNT_SCROBBLES_DISABLE,
    });
  };
}
