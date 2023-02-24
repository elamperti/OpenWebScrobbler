import { discogsAPI } from 'utils/adapters';

import { discogsClient, lastfmClient } from 'utils/clients';

import {
  GET_ALBUM_INFO,
  CLEAR_ALBUM_SEARCH,
  CLEAR_ALBUM_ARTIST_SEARCH,
  CLEAR_ALBUM_TRACKLIST,
  SEARCH_ALBUM,
  SEARCH_TOP_ALBUMS,
  SET_ALBUM_QUERY,
  SET_ARTIST_QUERY,
  PROVIDER_DISCOGS,
} from 'Constants';

export function searchAlbums(album, options = {}) {
  return {
    type: SEARCH_ALBUM,
    payload:
      options.provider === PROVIDER_DISCOGS
        ? discogsClient.albumSearch(album, options.includeReleases)
        : lastfmClient.albumSearch(album),
  };
}

export function searchTopAlbums(artist) {
  return {
    type: SEARCH_TOP_ALBUMS,
    payload: artist.discogsId ? discogsClient.searchTopAlbums(artist.discogsId) : lastfmClient.searchTopAlbums(artist),
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

export async function _discogsFindBestMatch(album) {
  const { data } = await discogsAPI.get('', {
    params: {
      method: 'album.search',
      type: 'release',
      // toLowerCase dedupes case-sensitive cached queries
      artist: album.artist.toLowerCase(),
      title: album.name.toLowerCase(),
    },
  });

  if (data.results && data.results.length > 0) {
    return data.results[0].master_id || data.results[0].id;
  }
}

export function getAlbum(album) {
  return {
    type: GET_ALBUM_INFO,
    payload: album.discogsId ? discogsClient.albumGetInfo(album.discogsId) : lastfmClient.albumGetInfo(album),
  };
}
