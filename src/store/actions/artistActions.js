import axios from 'axios';

import {
  AUDIOSCROBBLER_API_URL,
  SEARCH_ARTIST_LASTFM,
} from 'Constants';

export function searchArtists(artist, options) {
  return {
    type: SEARCH_ARTIST_LASTFM,
    payload: axios.get(AUDIOSCROBBLER_API_URL, {
      params: {
        method: 'artist.search',
        artist,
        limit: 12, // Receiving 50 artists was unnecessary
        api_key: process.env.REACT_APP_LASTFM_API_KEY,
        format: 'json',
      },
    }),
  };
}
