import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  USER_GET_INFO,
  FETCH_LASTFM_USER_INFO,
  FETCH_LASTFM_USER_HISTORY,
  GET_ALBUM_INFO,
  MAX_RECENT_USERS,
  MAX_RECENT_ALBUMS,
  PROVIDER_DISCOGS,
} from 'Constants';

type UserSettings = {
  dataProvider: 'discogs' | 'lastfm';
  isLoggedIn: boolean | null;
  name: string;
  profiles: any;
  recentProfiles: any;
  recentAlbums: any;
  url: string;
  userSettingsLoading: boolean;
};

const initialState: UserSettings = {
  dataProvider: PROVIDER_DISCOGS,
  isLoggedIn: null,
  name: '',
  profiles: {},
  recentProfiles: [],
  recentAlbums: [],
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
      if (hasIn(action.payload, 'data.user')) {
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
        const avatars = {
          sm: '',
          md: '',
          lg: '',
          // xl: '',
        };

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
        const thisPage = get(action.payload, 'data.recenttracks[@attr].page', 1);
        const scrobbles = get(profiles, `[${username}].scrobbles`, []);

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

        scrobbles[thisPage] = newScrobbles;

        profiles[username] = {
          ...get(profiles, username, {}),
          scrobbles,
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

    case `${GET_ALBUM_INFO}_FULFILLED`: {
      const recentAlbums = state.recentAlbums || [];
      const newAlbum = get(action.payload, 'info', {});

      // No use in storing an empty or broken album
      if (newAlbum.trackCount === 0) return state;

      const previousIndex = recentAlbums.findIndex(
        ({ title, artist }) => title === newAlbum.title && artist === newAlbum.artist
      );
      if (previousIndex > -1) {
        recentAlbums.splice(previousIndex, 1);
      }
      recentAlbums.unshift(newAlbum);

      return {
        ...state,
        recentAlbums: recentAlbums.slice(0, MAX_RECENT_ALBUMS),
      };
    }

    default:
      return state;
  }
};

export default userReducer;
