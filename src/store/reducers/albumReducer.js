import get from 'lodash/get';
import {
  fetchLastfmAlbums,
  fetchDiscogsAlbums,
  fetchLastfmAlbumInfo,
  fetchDiscogsAlbumInfo,
  fetchLastfmTopAlbums,
  fetchDiscogsTopAlbums,
} from 'store/transformers/albumTransformer';
import { fetchLastfmTracks, fetchDiscogsTracks } from 'store/transformers/trackTransformer';

import {
  GET_ALBUM_INFO_LASTFM,
  GET_ALBUM_INFO_DISCOGS,
  SEARCH_ALBUM_LASTFM,
  SEARCH_ALBUM_DISCOGS,
  SEARCH_TOP_ALBUMS_LASTFM,
  SEARCH_TOP_ALBUMS_DISCOGS,
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
    case `${SEARCH_ALBUM_DISCOGS}_REJECTED`:
    case `${SEARCH_TOP_ALBUMS_LASTFM}_REJECTED`:
    case `${SEARCH_TOP_ALBUMS_DISCOGS}_REJECTED`:
      // do something with action.payload
      return {
        ...state,
        list: [],
      };

    case `${SEARCH_ALBUM_LASTFM}_FULFILLED`:
      return {
        ...state,
        list: fetchLastfmAlbums(get(action.payload, 'data', [])),
      };

    case `${SEARCH_ALBUM_DISCOGS}_FULFILLED`:
      return {
        ...state,
        list: fetchDiscogsAlbums(get(action.payload, 'data', [])),
      };

    case `${SEARCH_TOP_ALBUMS_LASTFM}_FULFILLED`: {
      const lastfmTopAlbums = fetchLastfmTopAlbums(get(action.payload, 'data', []));
      return {
        ...state,
        queries: {
          ...state.queries,
          artist: lastfmTopAlbums ? lastfmTopAlbums[0].artist : state.queries.artist,
        },
        list: lastfmTopAlbums,
      };
    }

    case `${SEARCH_TOP_ALBUMS_DISCOGS}_FULFILLED`: {
      const discogsTopAlbums = fetchDiscogsTopAlbums(get(action.payload, 'data', []));
      return {
        ...state,
        queries: {
          ...state.queries,
          artist: discogsTopAlbums ? discogsTopAlbums[0].artist : state.queries.artist,
        },
        list: discogsTopAlbums,
      };
    }

    case `${GET_ALBUM_INFO_LASTFM}_FULFILLED`:
      info = fetchLastfmAlbumInfo(get(action.payload, 'data', {}));

      return {
        ...state,
        info,
        tracks: fetchLastfmTracks(get(action.payload, 'data.album.tracks.track', []), {
          album: info.name,
          cover: info.cover,
        }),
      };

    case `${GET_ALBUM_INFO_DISCOGS}_FULFILLED`:
      info = fetchDiscogsAlbumInfo(get(action.payload, 'data', {}));

      return {
        ...state,
        info,
        tracks: fetchDiscogsTracks(get(action.payload, 'data.tracklist', []), {
          artist: info.artist,
          album: info.name,
          cover: info.cover,
        }),
      };

    default:
      return state;
  }
};

export default albumReducer;
