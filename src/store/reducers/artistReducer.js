import get from 'lodash/get';
import { fetchArtists } from 'store/transformers/artistTransformer';

import {
  SEARCH_ARTIST_LASTFM,
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
      // do something with action.payload
      return state;

    case `${SEARCH_ARTIST_LASTFM}_FULFILLED`:
      state.list = fetchArtists(get(action.payload, 'data', {}));
      return state;

    default:
      return state;
  }
};

export default artistReducer;
