import get from 'lodash/get';

import {
  GET_ALBUM_INFO,
  SEARCH_ALBUM,
  SEARCH_TOP_ALBUMS,
  SET_ALBUM_QUERY,
  SET_ARTIST_QUERY,
  CLEAR_ALBUM_SEARCH,
  CLEAR_ALBUM_ARTIST_SEARCH,
  CLEAR_ALBUM_TRACKLIST,
  USER_LOGGED_OUT,
} from 'Constants';

const initialState = {
  info: {},
  list: null,
  tracks: null,
  queries: {
    artist: '',
    album: '',
  },
};

const albumReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGGED_OUT:
      return {
        ...initialState,
      };

    case CLEAR_ALBUM_ARTIST_SEARCH:
      return {
        ...initialState,
        queries: {
          ...initialState.queries,
          album: state.queries.album,
        },
      };

    case CLEAR_ALBUM_SEARCH:
      return {
        ...initialState,
      };

    case CLEAR_ALBUM_TRACKLIST:
      return {
        ...state,
        tracks: null,
      };

    case SET_ALBUM_QUERY:
      return {
        ...state,
        queries: {
          ...state.queries,
          album: action.payload,
        },
      };

    case SET_ARTIST_QUERY:
      return {
        ...state,
        queries: {
          ...state.queries,
          artist: action.payload,
        },
      };

    case `${SEARCH_ALBUM}_REJECTED`:
    case `${SEARCH_TOP_ALBUMS}_REJECTED`:
      // do something with action.payload
      return {
        ...state,
        list: [],
      };

    case `${SEARCH_ALBUM}_FULFILLED`:
      return {
        ...state,
        list: action.payload,
      };

    case `${SEARCH_TOP_ALBUMS}_FULFILLED`: {
      return {
        ...state,
        queries: {
          ...state.queries,
          artist:
            action.payload && action.payload.length > 0 ? get(action.payload[0], 'artist', '') : state.queries.artist,
        },
        list: action.payload,
      };
    }

    case `${GET_ALBUM_INFO}_REJECTED`: {
      return {
        ...state,
        info: {},
        tracks: [],
      };
    }

    case `${GET_ALBUM_INFO}_FULFILLED`: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
};

export default albumReducer;
