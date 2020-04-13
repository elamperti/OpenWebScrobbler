import get from 'lodash/get'

export function fetchArtists(response) {
  let artists = []
  const rawArtistList = get(response, 'results.artistmatches.artist', [])

  for (let artist of rawArtistList) {
    artists.push({
      name: artist.name,
      mbid: artist.mbid,
      url: artist.url,
      avatar: {
        'sm': get(artist, 'image[1][#text]'),
        'md': get(artist, 'image[2][#text]'),
        'lg': get(artist, 'image[3][#text]'),
        'xl': get(artist, 'image[4][#text]'),
      }
    })
  }
  return artists
}
