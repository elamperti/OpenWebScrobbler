import axios from 'axios';

import {
  AUDIOSCROBBLER_API_URL,
  SEARCH_ARTIST_LASTFM,
  SEARCH_ARTIST_TOP_ALBUMS_LASTFM,
} from 'Constants';

export function searchArtists(dispatch) {
  return (artist, options, callback) => {
    const response = dispatch({
      type: SEARCH_ARTIST_LASTFM,
      payload: axios.get(AUDIOSCROBBLER_API_URL, {
        params: {
          method: 'artist.search',
          artist,
          limit: 12, // Receiving 50 artists was unnecessary
          api_key: process.env.REACT_APP_LASTFM_API_KEY,
          format: 'json'
        },
      })
    });

    if (typeof callback === 'function') {
      response.then((res) => {
        callback(res);
      });
    }
  };
}

export function searchArtistTopAlbums(dispatch) {
  return (artist, callback) => {
    let searchParams = {};
    if (artist.mbid) {
      searchParams.mbid = artist.mbid;
    } else {
      searchParams.artist = artist.name;
    }

    const response = dispatch({
      type: SEARCH_ARTIST_TOP_ALBUMS_LASTFM,
      payload: axios.get(AUDIOSCROBBLER_API_URL, {
        params: {
          method: 'artist.getTopAlbums',
          ...searchParams,
          api_key: process.env.REACT_APP_LASTFM_API_KEY,
          format: 'json'
        },
      })
    });

    if (typeof callback === 'function') {
      response.then((res) => {
        callback(res);
      });
    }
  };
}
