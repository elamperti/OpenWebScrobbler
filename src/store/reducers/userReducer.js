import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

const initialState = {
  isLoggedIn: null,
  name: '',
  url: '',
  // country: '',
  avatarURL: '',
  userSettingsLoading: false,
  profileScrobblesLoading: false,
  profileScrobbles: {},
};

const userReducer = (state=initialState, action) => {
  let profileScrobbles = state.profileScrobbles || {};

  switch (action.type) {
    case 'USER_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: true,
      }

    case 'USER_LOGGED_OUT':
      return {
          ...initialState,
          isLoggedIn: false,
      }

    case 'USER_GET_INFO_PENDING':
      return {
        ...state,
        userSettingsLoading: true,
      }

    case 'USER_GET_INFO_REJECTED':
      // ToDo: Handle this failure gracefully
      return {
        ...state,
        userSettingsLoading: false,
      }

    case 'USER_GET_INFO_FULFILLED':
      if (action.payload.data.user) {
        let userData = action.payload.data.user;
        return {
          ...state,
          isLoggedIn: true,
          name: userData.name || '',
          url: userData.url || '',
          // country: userData.country || '',
          avatarURL: userData.image ? userData.image[1]['#text'] : '',
        }
      } else if (action.payload.data.hasOwnProperty('isLoggedIn')) {
        return {
          ...state,
          isLoggedIn: action.payload.data.isLoggedIn,
        }
      } else {
        return state;
      }

    case 'FETCH_LASTFM_USER_HISTORY_PENDING':
      return {
        ...state,
        profileScrobblesLoading: true,
      };

    case 'FETCH_LASTFM_USER_HISTORY_REJECTED':
      return {
        ...state,
        profileScrobblesLoading: false,
      };

    case 'FETCH_LASTFM_USER_HISTORY_FULFILLED':
      if (hasIn(action.payload, 'data.recenttracks.track')) {
        let newScrobbles = [];
        let username = get(action.payload, 'data.recenttracks[@attr].user');

        for (let item of action.payload.data.recenttracks.track) {
          if (!get(item, '[@attr].nowplaying', false)) {
            newScrobbles.unshift({
              artist: item.artist['#text'],
              title: item.name,
              album: item.album['#text'],
              albumArtist: null,
              timestamp: new Date(item.date.uts * 1000),
            });
          }
        }
        profileScrobbles[username] = newScrobbles;
      }
      return {
        ...state,
        profileScrobblesLoading: false,
        profileScrobbles,
      };

    default:
      return state;
  }
};

export default userReducer;
