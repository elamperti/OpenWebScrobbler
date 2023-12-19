import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  USER_GET_INFO,
  USER_ADD_RECENT_PROFILE,
  MAX_RECENT_USERS,
  MAX_RECENT_ALBUMS,
  PROVIDER_DISCOGS,
  Provider,
  USER_SAVE_INFO,
  GET_ALBUM_INFO,
} from 'Constants';

import { userProfileTransformer } from '../../utils/clients/lastfm/transformers/userProfile.transformer';
import { Avatar } from 'utils/types/avatar';

type UserSettings = {
  avatar: Avatar;
  dataProvider: Provider;
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
  avatar: null,
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
        return {
          ...state,
          isLoggedIn: true,
          ...userProfileTransformer(action.payload),
        };
      } else if (hasIn(action.payload, 'data.isLoggedIn')) {
        return {
          ...state,
          isLoggedIn: action.payload.data.isLoggedIn,
        };
      } else {
        return state;
      }

    case USER_SAVE_INFO:
      if (hasIn(action.payload, 'name')) {
        const username = action.payload.name;

        profiles[username] = {
          ...get(profiles, username, {}),
          ...action.payload,
        };
        return {
          ...state,
          profiles,
        };
      } else {
        // eslint-disable-next-line no-console
        console.warn('Unexpected payload in USER_SAVE_INFO');
        return state;
      }

    case USER_ADD_RECENT_PROFILE: {
      const username = action.payload;

      const currentIndex = recentProfiles.indexOf(username);
      if (currentIndex > -1) {
        recentProfiles.splice(currentIndex, 1);
      }

      recentProfiles.unshift(username);
      recentProfiles = recentProfiles.slice(0, MAX_RECENT_USERS);

      return {
        ...state,
        recentProfiles,
      };
    }

    case GET_ALBUM_INFO: {
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
