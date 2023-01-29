import axios from 'axios';
import get from 'lodash/get';
import hasIn from 'lodash/hasIn';
import shortid from 'shortid';

import {
  ENQUEUE_NEW,
  FLUSH_QUEUE,
  COUNT_SCROBBLES_ENABLE,
  COUNT_SCROBBLES_DISABLE,
  USER_LOGGED_OUT,
  CLEAR_SCROBBLES_LIST,
  SCROBBLE,
  SCROBBLE_COVER_SEARCH,
  OPENSCROBBLER_API_URL,
  MAX_SCROBBLES_PER_REQUEST,
} from 'Constants';
import { prepareScrobbles } from 'store/transformers/scrobbleTransformer';

const initialState = {
  countNewScrobbles: false,
  unreadCount: 0,
  list: [],
};

function updateScrobbleProps(state, scrobbleUUID, newProps) {
  if (!scrobbleUUID || !newProps) return state;
  if (newProps.timestamp && newProps.timestamp.valueOf() === 0) {
    // ToDo: update timestamp with response value for multiple scrobbles
    delete newProps.timestamp;
  }
  return {
    ...state,
    list: state.list.map((item) => {
      if (item.scrobbleUUID !== scrobbleUUID) {
        return item;
      } else {
        return {
          ...item,
          ...newProps,
        };
      }
    }),
  };
}

const scrobbleReducer = (state = initialState, action) => {
  let status, errorDescription;
  let trackUUID;
  let albumData;

  switch (action.type) {
    case ENQUEUE_NEW: {
      const newScrobbles = action.payload.scrobbles.map((scrobble) => {
        return {
          ...scrobble,
          status: 'queued',
        };
      });

      return {
        ...state,
        unreadCount: state.countNewScrobbles ? (state.unreadCount || 0) + newScrobbles.length : 0,
        list: [...state.list, ...newScrobbles],
      };
    }

    case FLUSH_QUEUE: {
      const scrobbleUUID = shortid.generate();
      const { dispatch } = action.payload; // sorry :(

      const queuedScrobbles = state.list.filter(({ status }) => status === 'queued');
      const scrobbles = queuedScrobbles.splice(-MAX_SCROBBLES_PER_REQUEST, MAX_SCROBBLES_PER_REQUEST);
      const scrobbledIds = scrobbles.map(({ id }) => id);

      if (scrobbles.length > 0) {
        // Dispatch axios promise
        setTimeout(
          () =>
            dispatch({
              type: SCROBBLE,
              payload: axios.post(`${OPENSCROBBLER_API_URL}/scrobble.php`, prepareScrobbles(scrobbles), {
                headers: {
                  scrobbleUUID,
                },
              }),
            }),
          0
        );
      }

      // Flush any pending scrobbles if there were more than MAX_SCROBBLES_PER_REQUEST
      if (queuedScrobbles.length > 0) {
        setTimeout(
          () =>
            dispatch({
              type: FLUSH_QUEUE,
              payload: { dispatch },
            }),
          500
        ); // Wait period between queue flushes
      }

      return {
        ...state,
        list: state.list.map((scrobble) => {
          if (scrobbledIds.includes(scrobble.id)) {
            scrobble.scrobbleUUID = scrobbleUUID;
            scrobble.status = 'pending';
          }
          return scrobble;
        }),
      };
    }

    case COUNT_SCROBBLES_ENABLE:
      return {
        ...state,
        countNewScrobbles: true,
      };

    case COUNT_SCROBBLES_DISABLE:
      return {
        ...state,
        unreadCount: 0,
        countNewScrobbles: false,
      };

    case USER_LOGGED_OUT:
      return initialState;

    case CLEAR_SCROBBLES_LIST:
      return {
        ...state,
        unreadCount: 0,
        list: [],
      };

    case `${SCROBBLE}_FULFILLED`:
      if (hasIn(action.payload, 'data.scrobbles[@attr]')) {
        status = action.payload.data.scrobbles['@attr'].ignored ? 'error' : 'success';
        errorDescription = status === 'error' ? 'errors.lastfmRejected' : null;
        return updateScrobbleProps(state, action.payload.config.headers.scrobbleUUID, {
          status,
          errorDescription,
          timestamp: new Date(get(action.payload.data.scrobbles.scrobble, 'timestamp', 0) * 1000),
        });
      } else {
        /* eslint-disable no-console */
        console.error('Unexpected scrobble response', action.payload.data);
        return updateScrobbleProps(state, action.payload.config.headers.scrobbleUUID, {
          status: 'error',
          errorMessage: get(action.payload, 'data.message'),
          errorDescription: 'errors.unexpectedResponse',
        });
      }

    case `${SCROBBLE}_REJECTED`:
      if (hasIn(action.payload, 'config.headers.scrobbleUUID')) {
        return updateScrobbleProps(state, action.payload.config.headers.scrobbleUUID, {
          status: 'error',
          errorDescription: 'errors.apiCallFailed',
        });
      }
      return state;

    case `${SCROBBLE_COVER_SEARCH}_FULFILLED`:
      trackUUID = action.payload.config.params._uuid;
      if (hasIn(action.payload, 'data.track.album') || hasIn(action.payload, 'data.album')) {
        albumData = action.payload.data.album || action.payload.data.track.album;
        if (albumData.image) {
          const cover = albumData.image[1]['#text'];
          return {
            ...state,
            list: state.list.map((item) => {
              if (item.id !== trackUUID) {
                return item;
              } else {
                return {
                  ...item,
                  cover,
                };
              }
            }),
          };
        }
      }
      return state;

    default:
      return state;
  }
};

export default scrobbleReducer;
