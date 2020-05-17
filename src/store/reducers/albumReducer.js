import get from 'lodash/get';
import {
  fetchAlbums,
  fetchAlbumInfo,
} from 'store/transformers/albumTransformer';
import { fetchTracks } from 'store/transformers/trackTransformer';
import md5 from 'md5';

import {
  GET_ALBUM_INFO_LASTFM,
  SEARCH_ALBUM_LASTFM,
  USER_LOGGED_OUT,
} from 'Constants';

const initialState = {
  searchCache: {},
  albumsCache: {},
};

const albumReducer = (state = initialState, action) => {
  let mbid;
  let searchQuery;
  let albumInfo;

  switch (action.type) {
    case USER_LOGGED_OUT:
      return initialState;

    case `${SEARCH_ALBUM_LASTFM}_REJECTED`:
      // do something with action.payload
      return state;

    case `${SEARCH_ALBUM_LASTFM}_FULFILLED`:
      searchQuery = action.payload.config.params.album.toLowerCase();
      state.searchCache[searchQuery] = fetchAlbums(get(action.payload, 'data', {}));
      return state;

    case `${GET_ALBUM_INFO_LASTFM}_FULFILLED`:
      mbid = action.payload.config.params.mbid || md5(`${action.payload.config.params.artist} - ${action.payload.config.params.album}`);
      albumInfo = fetchAlbumInfo(get(action.payload, 'data', {}));

      state.albumsCache[mbid] = {
        info: albumInfo,
        tracks: fetchTracks(get(action.payload, 'data.album.tracks.track', []), {
          album: albumInfo.name,
          cover: albumInfo.cover,
        }),
      };
      return state;

    default:
      return state;
  }
};

export default albumReducer;
