import get from 'lodash/get';
import {
  fetchLastfmArtists,
  fetchDiscogsArtists,
} from 'store/transformers/artistTransformer';

import {
  SEARCH_ARTIST_LASTFM,
  SEARCH_ARTIST_DISCOGS,
  USER_LOGGED_OUT,
  CLEAR_ALBUM_SEARCH,
} from 'Constants';

const initialState = {
  list: null,
};

const artistReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGGED_OUT:
    case CLEAR_ALBUM_SEARCH:
      return {
        ...initialState,
      };

    case `${SEARCH_ARTIST_LASTFM}_REJECTED`:
    case `${SEARCH_ARTIST_DISCOGS}_REJECTED`:
      // do something with action.payload
      return state;

    case `${SEARCH_ARTIST_LASTFM}_FULFILLED`:
      return {
        ...state,
        list: fetchLastfmArtists(get(action.payload, 'data', {})),
      };

    case `${SEARCH_ARTIST_DISCOGS}_FULFILLED`:
      return {
        ...state,
        list: fetchDiscogsArtists(get(action.payload, 'data', {})),
      };

    default:
      return state;
  }
};

export default artistReducer;
