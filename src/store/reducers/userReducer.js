import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

const MAX_RECENT_USERS = 6;

const initialState = {
  isLoggedIn: null,
  name: '',
  url: '',
  userSettingsLoading: false,
  profiles: {},
  recentProfiles: [],
};

const userReducer = (state=initialState, action) => {
  let profiles = state.profiles || {};
  let recentProfiles = state.recentProfiles || [];

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
      // ToDo: Handle this failure
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
          avatar: userData.image ? {sm: userData.image[1]['#text']} : '',
        }
      } else if (action.payload.data.hasOwnProperty('isLoggedIn')) {
        return {
          ...state,
          isLoggedIn: action.payload.data.isLoggedIn,
        }
      } else {
        return state;
      }

    case 'FETCH_LASTFM_USER_INFO_FULFILLED':
      if (hasIn(action.payload, 'data.user')) {
        let username = action.payload.data.user.name;
        let avatars = {};

        for (let avatar of get(action.payload.data.user, 'image')) {
          switch (avatar.size) {
            case 'small':
              avatars['sm'] = avatar['#text'];
              break;
            case 'medium':
              avatars['md'] = avatar['#text'];
              break;
            default:
            case 'large':
              avatars['lg'] = avatar['#text'];
              break;
            // case 'extralarge':
            //   avatars['xl'] = avatar['#text'];
            //   break;
          }
        }

        profiles[username] = {
          ...get(profiles, username, {}),
          avatar: avatars,
        };
        return {
          ...state,
          profiles,
        }
      } else {
        // ToDo: the user wasn't found, do something?
        return state;
      }

    case 'FETCH_LASTFM_USER_HISTORY_FULFILLED':
      if (hasIn(action.payload, 'data.recenttracks.track')) {
        let newScrobbles = [];
        let username = get(action.payload, 'data.recenttracks[@attr].user', '');

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

        profiles[username] = {
          ...get(profiles, username, {}),
          scrobbles: newScrobbles,
        };

        let i = recentProfiles.indexOf(username);
        if (i > -1) {
          recentProfiles.splice(i, 1);
        }
        recentProfiles.unshift(username);
        recentProfiles = recentProfiles.slice(0, MAX_RECENT_USERS);
      }
      return {
        ...state,
        profiles,
        recentProfiles,
      };

    default:
      return state;
  }
};

export default userReducer;
