import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

import {
  USER_GET_INFO,
  USER_ADD_RECENT_PROFILE,
  MAX_RECENT_USERS,
  MAX_RECENT_ALBUMS,
  USER_SAVE_INFO,
  GET_ALBUM_INFO,
} from 'Constants';

import { userProfileTransformer } from '../../utils/clients/lastfm/transformers/userProfile.transformer';

type UserSettings = {
  profiles: any;
  recentProfiles: any;
  recentAlbums: any;
};

const initialState: UserSettings = {
  profiles: {},
  recentProfiles: [],
  recentAlbums: [],
};

const userReducer = (state = initialState, action) => {
  const profiles = state.profiles || {};
  let recentProfiles = state.recentProfiles || [];

  switch (action.type) {
    case USER_GET_INFO:
      if (hasIn(action.payload, 'data.user')) {
        return {
          ...state,
          ...userProfileTransformer(action.payload),
        };
      } else if (hasIn(action.payload, 'data.isLoggedIn')) {
        return {
          ...state,
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
