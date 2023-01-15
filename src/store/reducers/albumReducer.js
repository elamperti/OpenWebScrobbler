import get from 'lodash/get';
import { fetchLastfmAlbumInfo, fetchDiscogsAlbumInfo } from 'store/transformers/albumTransformer';
import { fetchLastfmTracks, fetchDiscogsTracks } from 'store/transformers/trackTransformer';

import { castArray } from 'utils/common';

import {
  GET_ALBUM_INFO_LASTFM,
  GET_ALBUM_INFO_DISCOGS,
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

    case `${GET_ALBUM_INFO_LASTFM}_FULFILLED`: {
      const info = fetchLastfmAlbumInfo(get(action.payload, 'data', {}));
      // tracks.track can be either an array of tracks or just a track object (when it's only one track).
      // A consistency only second to that of jelly.
      const tracks = castArray(get(action.payload, 'data.album.tracks.track', []));

      return {
        ...state,
        info,
        tracks: fetchLastfmTracks(tracks, {
          album: info.name,
          cover: info.cover,
        }),
      };
    }

    case `${GET_ALBUM_INFO_DISCOGS}_FULFILLED`: {
      const info = fetchDiscogsAlbumInfo(get(action.payload, 'data', {}));

      return {
        ...state,
        info,
        tracks: fetchDiscogsTracks(get(action.payload, 'data', {}), {
          artist: info.artist,
          album: info.name,
          cover: info.cover,
        }),
      };
    }

    case `${GET_ALBUM_INFO_LASTFM}_REJECTED`:
    case `${GET_ALBUM_INFO_DISCOGS}_REJECTED`: {
      return {
        ...state,
        info: {},
        tracks: [],
      };
    }

    default:
      return state;
  }
};

export default albumReducer;
