import get from 'lodash/get';
import { fetchArtists } from 'store/transformers/artistTransformer';
import { fetchTopAlbums } from '../transformers/albumTransformer';

import {
  SEARCH_ARTIST_LASTFM,
  SEARCH_ARTIST_TOP_ALBUMS_LASTFM,
  USER_LOGGED_OUT,
} from 'Constants';

const initialState = {
  cache: {},
  topAlbums: {},
};

const artistReducer = (state=initialState, action) => {
  let searchQuery;

  switch (action.type) {
    case USER_LOGGED_OUT:
      return initialState;

    case `${SEARCH_ARTIST_LASTFM}_REJECTED`:
      // do something with action.payload
      return state;

    case `${SEARCH_ARTIST_LASTFM}_FULFILLED`:
      searchQuery = action.payload.config.params.artist.toLowerCase();
      state.cache[searchQuery] = fetchArtists(get(action.payload, 'data', {}));
      return state;

    case `${SEARCH_ARTIST_TOP_ALBUMS_LASTFM}_FULFILLED`:
      state.topAlbums[action.payload.config.params.mbid || action.payload.config.params.artist] = fetchTopAlbums(get(action.payload, 'data', {}));
      return state;

    default:
      return state;
  }
};

export default artistReducer;
