import hasIn from 'lodash/hasIn';

const initialState = {
  list: []
};

function updateScrobbleProps(state, scrobbleUUID, newProps) {
  if (!scrobbleUUID || !newProps) return state;
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

const scrobbleReducer = (state=initialState, action) => {
  let status, errorDescription;

  switch (action.type) {
    case 'ENQUEUE_NEW':
      let newScrobbles = [];

      for (let scrobble of action.payload.scrobbles) {
        newScrobbles.push({
          ...scrobble,
          status: 'pending',
          scrobbleUUID: action.payload.scrobbleUUID,
        });
      }

      return {
        list: [
          ...state.list,
          ...newScrobbles,
        ]
      };

    case 'USER_LOGGED_OUT':
      return initialState;

    case 'CLEAR_SCROBBLES_LIST':
      return {
        ...state,
        list: [],
      };

    case 'SCROBBLE_FULFILLED':
      if (hasIn(action.payload, 'data.scrobbles[@attr]')) {
        status = action.payload.data.scrobbles['@attr'].ignored ? 'error' : 'success';
        errorDescription = status === 'error' ? 'errors.lastfmRejected' : null;
        return updateScrobbleProps(state, action.payload.config.headers.scrobbleUUID, {
          status,
          errorDescription,
        });
      } else {
        console.error('Unexpected scrobble response', action.payload.data);
        return updateScrobbleProps(state, action.payload.config.headers.scrobbleUUID, {
          status: 'error',
          errorDescription: 'errors.unexpectedResponse',
        });
      }

    case 'SCROBBLE_REJECTED':
      if (hasIn(action.payload, 'config.headers.scrobbleUUID')) {
        return updateScrobbleProps(state, action.payload.config.headers.scrobbleUUID, {
          status: 'error',
          errorDescription: 'errors.apiCallFailed',
        });
      }
      return state;

    case 'SCROBBLE_COVER_SEARCH_FULFILLED':
      let trackUUID = action.payload.config.params.ows_scrobbleUUID;
      let albumData;
      if (hasIn(action.payload, 'data.track.album') || hasIn(action.payload, 'data.album')) {
        albumData = action.payload.data.album || action.payload.data.track.album;
        if (albumData.image) {
          let cover = albumData.image[1]['#text'];
          return {
            ...state,
            list: state.list.map((item) => {
              if (item.id !== trackUUID) {
                return item;
              } else {
                return {
                  ...item,
                  cover
                }
              }
            })
          };
        }
      }
      return state;

    default:
      return state;
  }
};

export default scrobbleReducer;
