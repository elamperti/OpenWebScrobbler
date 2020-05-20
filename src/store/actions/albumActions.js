import { lastfmAPI } from 'utils/adapters';

import {
  GET_ALBUM_INFO_LASTFM,
  CLEAR_ALBUM_SEARCH,
  CLEAR_ALBUM_ARTIST_SEARCH,
  CLEAR_ALBUM_TRACKLIST,
  SEARCH_ALBUM_LASTFM,
  SEARCH_TOP_ALBUMS_LASTFM,
  SET_ALBUM_QUERY,
  SET_ARTIST_QUERY,
} from 'Constants';

export function searchAlbums(album, options) {
  return {
    type: SEARCH_ALBUM_LASTFM,
    payload: lastfmAPI.get('', {
      params: {
        method: 'album.search',
        album: album.toLowerCase(), // dedupes case-sensitive cached queries
      },
    }),
  };
}

export function searchTopAlbums(artist, options) {
  const params = {
    method: 'artist.getTopAlbums',
    api_key: process.env.REACT_APP_LASTFM_API_KEY,
    format: 'json',
  };

  if (artist.mbid) {
    params.mbid = artist.mbid;
  } else {
    params.artist = artist.name.toLowerCase(); // dedupes case-sensitive cached queries
  }

  return {
    type: SEARCH_TOP_ALBUMS_LASTFM,
    payload: lastfmAPI.get('', {
      params,
    }),
  };
}

export function setAlbumQuery(query) {
  return {
    type: SET_ALBUM_QUERY,
    payload: query,
  };
}

export function setArtistQuery(query) {
  return {
    type: SET_ARTIST_QUERY,
    payload: query,
  };
}

export function clearAlbumsSearch() {
  return {
    type: CLEAR_ALBUM_SEARCH,
  };
}

export function clearAlbumsArtistSearch() {
  return {
    type: CLEAR_ALBUM_ARTIST_SEARCH,
  };
}

export function clearAlbumTracklist() {
  return {
    type: CLEAR_ALBUM_TRACKLIST,
  };
}

export function getAlbum(album) {
  const searchParams = {};
  if (album.mbid) {
    searchParams.mbid = album.mbid;
  } else {
    searchParams.artist = album.artist;
    searchParams.album = album.name;
  }

  return {
    type: GET_ALBUM_INFO_LASTFM,
    payload: lastfmAPI.get('', {
      params: {
        method: 'album.getInfo',
        ...searchParams,
      },
    }),
  };
}
