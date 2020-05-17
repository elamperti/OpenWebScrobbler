import axios from 'axios';

import {
  AUDIOSCROBBLER_API_URL,
  GET_ALBUM_INFO_LASTFM,
  SEARCH_ALBUM_LASTFM,
} from 'Constants';

export function searchAlbums(dispatch) {
  return (album, options, callback) => {
    const response = dispatch({
      type: SEARCH_ALBUM_LASTFM,
      payload: axios.get(AUDIOSCROBBLER_API_URL, {
        params: {
          method: 'album.search',
          album,
          api_key: process.env.REACT_APP_LASTFM_API_KEY,
          format: 'json',
        },
      }),
    });

    if (typeof callback === 'function') {
      response.then((res) => {
        callback(res);
      });
    }
  };
}

export function getAlbum(dispatch) {
  return (album, callback) => {
    const searchParams = {};
    if (album.mbid) {
      searchParams.mbid = album.mbid;
    } else {
      searchParams.artist = album.artist;
      searchParams.album = album.name;
    }

    const response = dispatch({
      type: GET_ALBUM_INFO_LASTFM,
      payload: axios.get(AUDIOSCROBBLER_API_URL, {
        params: {
          method: 'album.getInfo',
          ...searchParams,
          api_key: process.env.REACT_APP_LASTFM_API_KEY,
          format: 'json',
        },
      }),
    });

    if (typeof callback === 'function') {
      response.then((res) => {
        callback(res);
      });
    }
  };
}
