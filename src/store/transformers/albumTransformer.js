import get from 'lodash/get';

import { sanitizeDiscogsArtistName } from './common/discogsTransformer';

export function fetchLastfmAlbumInfo(response) {
  const album = get(response, 'album', {});
  return {
    name: album.name,
    artist: album.artist,
    releasedate: album.releasedate,
    url: album.url,
    cover: {
      sm: get(album, 'image[2][#text]'),
      lg: get(album, 'image[3][#text]'),
    },
    coverSizes: {
      sm: 174,
      lg: 300,
    },
  };
}

export function fetchDiscogsAlbumInfo(response) {
  if (response.message) {
    return {};
  }

  const images = get(response, 'images', []);
  let image = images.find((image) => image.type === 'primary') || null;
  if (!image) {
    image = images.find((image) => image.type === 'secondary') || null;
  }

  return {
    name: response.title,
    artist: sanitizeDiscogsArtistName(get(response, 'artists[0].name', '')), // + response.artists.length > 1 ? '+' : ''
    releasedate: response.year,
    url: '',
    cover: image && {
      sm: image.uri150,
      lg: image.resource_url,
    },
    coverSizes: image && {
      sm: 150,
      lg: image.width,
    },
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
      cover: {
        sm: get(album, 'image[2][#text]'),
        lg: get(album, 'image[3][#text]'),
      },
      coverSizes: {
        sm: 174,
        lg: 300,
      },
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
      releasedate: album.year,
      cover: {
        sm: album.thumb,
        lg: album.cover_image,
      },
      coverSizes: {
        sm: 150,
        lg: 500,
      },
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
      cover: {
        sm: get(album, 'image[2][#text]'),
        lg: get(album, 'image[3][#text]'),
      },
      coverSizes: {
        sm: 174,
        lg: 300,
      },
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
    releasedate: album.year,
    cover: {
      sm: album.thumb,
      lg: album.cover_image || '', // only returning thumb at the moment
    },
    coverSizes: {
      sm: 150,
      lg: 500,
    },
  }));
}
