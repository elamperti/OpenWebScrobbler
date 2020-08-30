import axios from 'axios';
import { discogsAPI } from 'utils/adapters';

import { AUDIOSCROBBLER_API_URL, SEARCH_ARTIST_LASTFM, SEARCH_ARTIST_DISCOGS, PROVIDER_DISCOGS } from 'Constants';

export function searchArtists(artist, options = {}) {
  if (options.provider === PROVIDER_DISCOGS) {
    return {
      type: SEARCH_ARTIST_DISCOGS,
      payload: discogsAPI.get('', {
        params: {
          method: 'artist.search',
          type: 'artist',
          q: artist.toLowerCase(), // dedupes case-sensitive cached queries
        },
      }),
    };
  } else {
    // Last.fm request
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
}
