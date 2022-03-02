import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  USER_GET_INFO,
  FETCH_LASTFM_USER_INFO,
  FETCH_LASTFM_USER_HISTORY,
  MAX_RECENT_USERS,
  PROVIDER_DISCOGS,
} from 'Constants';

const initialState = {
  dataProvider: PROVIDER_DISCOGS,
  isLoggedIn: null,
  name: '',
  profiles: {},
  recentProfiles: [],
  url: '',
  userSettingsLoading: false,
};

const userReducer = (state = initialState, action) => {
  const profiles = state.profiles || {};
  let recentProfiles = state.recentProfiles || [];

  switch (action.type) {
    case USER_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: true,
      };

    case USER_LOGGED_OUT:
      return {
        ...initialState,
        isLoggedIn: false,
      };

    case `${USER_GET_INFO}_PENDING`:
      return {
        ...state,
        userSettingsLoading: true,
      };

    case `${USER_GET_INFO}_REJECTED`:
      // ToDo: Handle this failure
      return {
        ...state,
        userSettingsLoading: false,
      };

    case `${USER_GET_INFO}_FULFILLED`:
      if (action.payload.data.user) {
        const userData = action.payload.data.user;
        return {
          ...state,
          isLoggedIn: true,
          name: userData.name || '',
          url: userData.url || '',
          // country: userData.country || '',
          avatar: userData.image ? { sm: userData.image[1]['#text'] } : '',
        };
      } else if (hasIn(action.payload, 'data.isLoggedIn')) {
        return {
          ...state,
          isLoggedIn: action.payload.data.isLoggedIn,
        };
      } else {
        return state;
      }

    case `${FETCH_LASTFM_USER_INFO}_FULFILLED`:
      if (hasIn(action.payload, 'data.user')) {
        const username = action.payload.data.user.name;
        const avatars = {};

        for (const avatar of get(action.payload.data.user, 'image')) {
          switch (avatar.size) {
            case 'small':
              avatars.sm = avatar['#text'];
              break;
            case 'medium':
              avatars.md = avatar['#text'];
              break;
            case 'large':
            default:
              avatars.lg = avatar['#text'];
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
        };
      } else {
        // ToDo: the user wasn't found, do something?
        return state;
      }

    case `${FETCH_LASTFM_USER_HISTORY}_FULFILLED`:
      if (hasIn(action.payload, 'data.recenttracks.track')) {
        const newScrobbles = [];
        const username = get(action.payload, 'data.recenttracks[@attr].user', '');
        const totalPages = get(action.payload, 'data.recenttracks[@attr].totalPages', '');

        for (const item of get(action.payload, 'data.recenttracks.track', [])) {
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
          totalPages,
        };

        const i = recentProfiles.indexOf(username);
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
