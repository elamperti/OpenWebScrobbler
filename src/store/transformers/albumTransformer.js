import get from 'lodash/get';

import { sanitizeDiscogsArtistName } from './common/discogsTransformer';

export function fetchLastfmAlbumInfo(response) {
  const album = get(response, 'album', {});
  return {
    name: album.name,
    artist: album.artist,
    releasedate: album.releasedate,
    url: album.url,
    cover: get(album, 'image[2][#text]'),
  };
}

export function fetchDiscogsAlbumInfo(response) {
  if (response.message) {
    return {};
  }

  const primaryImage = get(response, 'images', []).find((image) => image.type === 'primary') || null;
  return {
    name: response.title,
    artist: sanitizeDiscogsArtistName(get(response, 'artists[0].name', '')), // + response.artists.length > 1 ? '+' : ''
    releasedate: response.year,
    url: '',
    cover: primaryImage && primaryImage.uri150,
  };
}

export function fetchLastfmAlbums(response) {
  const albums = [];
  const rawAlbumList = get(response, 'results.albummatches.album', []);

  for (const album of rawAlbumList) {
    if (album.name === '(null)') continue;
    albums.push({
      artist: album.artist,
      mbid: album.mbid,
      name: album.name,
      url: album.url, // <--
      cover: get(album, 'image[2][#text]'),
    });
  }
  return albums;
}

export function fetchDiscogsAlbums(response) {
  return get(response, 'results', []).map((album) => {
    return {
      artist: '', // It's part of the name, impossible to tell
      discogsId: `${album.type === 'master' ? '' : 'release-'}${album.master_id || album.id}`,
      name: album.title,
      url: '',
      cover: album.thumb,
    };
  });
}

// Yes, I wish it was as simple as making a decorator of fetchLastfmAlbums (it isn't)
export function fetchLastfmTopAlbums(response) {
  const albums = [];
  const rawAlbumList = get(response, 'topalbums.album', []);

  for (const album of rawAlbumList) {
    if (album.name === '(null)') continue;
    albums.push({
      artist: album.artist.name, // <--
      mbid: album.mbid,
      name: album.name,
      cover: get(album, 'image[2][#text]'),
    });
  }
  return albums;
}

export function fetchDiscogsTopAlbums(response) {
  return get(response, 'releases', []).map((album) => ({
    artist: sanitizeDiscogsArtistName(album.artist),
    discogsId: `${album.type === 'master' ? '' : 'release-'}${album.master_id || album.id}`,
    name: album.title,
    url: album.resource_url,
    cover: album.thumb,
  }));
}
