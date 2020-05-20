import get from 'lodash/get';
import {
  fetchAlbums,
  fetchAlbumInfo,
  fetchTopAlbums,
} from 'store/transformers/albumTransformer';
import { fetchTracks } from 'store/transformers/trackTransformer';

import {
  GET_ALBUM_INFO_LASTFM,
  SEARCH_ALBUM_LASTFM,
  SEARCH_TOP_ALBUMS_LASTFM,
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
  let info;

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

    case `${SEARCH_ALBUM_LASTFM}_REJECTED`:
    case `${SEARCH_TOP_ALBUMS_LASTFM}_REJECTED`:
      // do something with action.payload
      return {
        ...state,
        list: [],
      };

    case `${SEARCH_ALBUM_LASTFM}_FULFILLED`:
      return {
        ...state,
        list: fetchAlbums(get(action.payload, 'data', {})),
      };

    case `${SEARCH_TOP_ALBUMS_LASTFM}_FULFILLED`:
      return {
        ...state,
        list: fetchTopAlbums(get(action.payload, 'data', {})),
      };

    case `${GET_ALBUM_INFO_LASTFM}_FULFILLED`:
      info = fetchAlbumInfo(get(action.payload, 'data', {}));

      return {
        ...state,
        info,
        tracks: fetchTracks(get(action.payload, 'data.album.tracks.track', []), {
          album: info.name,
          cover: info.cover,
        }),
      };

    default:
      return state;
  }
};

export default albumReducer;
