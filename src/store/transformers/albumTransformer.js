import get from 'lodash/get'

export function fetchAlbumInfo(response) {
  const album = get(response, 'album', {})
  return {
    name: album.name,
    artist: album.artist,
    releasedate: album.releasedate,
    url: album.url,
    cover: get(album, 'image[2][#text]'),
  }
}

export function fetchAlbums(response) {
  let albums = []
  const rawAlbumList = get(response, 'results.albummatches.album', [])

  for (let album of rawAlbumList) {
    if (album.name === '(null)') continue
    albums.push({
      artist: album.artist,
      mbid: album.mbid,
      name: album.name,
      url: album.url,
      cover: get(album, 'image[2][#text]'),
    })
  }
  return albums
}

// Yes, I wish it was as simple as making a decorator of fetchAlbums (it isn't)
export function fetchTopAlbums(response) {
  let albums = []
  const rawAlbumList = get(response, 'topalbums.album', [])

  for (let album of rawAlbumList) {
    if (album.name === '(null)') continue
    albums.push({
      artist: album.artist.name,
      mbid: album.mbid,
      name: album.name,
      cover: get(album, 'image[2][#text]'),
    })
  }
  return albums
}
