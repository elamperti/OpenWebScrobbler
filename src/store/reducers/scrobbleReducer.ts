import axios from 'axios';
import { get, hasIn } from 'lodash-es';
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
import { castArray } from 'utils/common';
import { Scrobble } from 'utils/types/scrobble';

type ScrobbleState = {
  countNewScrobbles: boolean;
  unreadCount: number;
  list: Scrobble[];
};

const initialState: ScrobbleState = {
  countNewScrobbles: false,
  unreadCount: 0,
  list: [],
};

// This is not the best solution
function updateScrobbleProps(state, scrobbleUUID, payload) {
  if (!scrobbleUUID || !payload.scrobbles) return state;
  const scrobblesToModify = state.list.filter((item) => item.scrobbleUUID === scrobbleUUID); // .sort((a,b) => a.id - b.id); // Could lead to offset errors if there's a length mismatch

  if (payload.scrobbles.length !== scrobblesToModify.length) {
    // eslint-disable-next-line no-console
    console.warn('Unexpected count discrepancy while updating scrobble props');
  }

  payload.scrobbles.forEach((scrobble, i) => {
    const j = scrobblesToModify.findIndex((item) => item.setIndex === i);

    if (j === -1) {
      // eslint-disable-next-line no-console
      console.warn(`Unable to find scrobble with setIndex ${i} in set {$scrobbleUUID}`);
      return;
    }

    const scrobbleWasRejected = parseInt(scrobble.ignoredMessage.code) !== 0;
    const errorDescription = scrobbleWasRejected ? scrobble.ignoredMessage['#text'] || 'errors.lastfmRejected' : '';

    scrobblesToModify[j] = {
      ...scrobblesToModify[j],
      status: scrobbleWasRejected ? 'error' : 'success',
      errorDescription,
      timestamp: new Date(scrobble.timestamp * 1000),
      artist: scrobble.artist['#text'],
      track: scrobble.track['#text'],
      album: scrobble.album['#text'],
    };
  });

  return {
    ...state,
    list: state.list.map((item) => {
      if (item.scrobbleUUID !== scrobbleUUID) {
        return item;
      } else {
        return {
          ...item,
          ...scrobblesToModify.find((modified) => modified.id === item.id),
        };
      }
    }),
  };
}

// And this may be redundant
function overrideScrobbleProps(state, scrobbleUUID, newProps) {
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
        return updateScrobbleProps(state, action.payload.config.headers.scrobbleUUID, {
          scrobbles: castArray(action.payload.data.scrobbles.scrobble),
          // attr: action.payload.scrobbles['@attr'],
        });
      } else {
        /* eslint-disable no-console */
        if (process.env.NODE_ENV === 'development') {
          console.error('Unexpected scrobble response', action.payload.data);
        }
        return overrideScrobbleProps(state, action.payload.config.headers.scrobbleUUID, {
          status: 'error',
          errorMessage: get(action.payload, 'data.message'),
          errorDescription: 'errors.unexpectedResponse',
        });
      }

    case `${SCROBBLE}_REJECTED`:
      if (hasIn(action.payload, 'config.headers.scrobbleUUID')) {
        return overrideScrobbleProps(state, action.payload.config.headers.scrobbleUUID, {
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
