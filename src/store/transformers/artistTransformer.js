import get from 'lodash/get';

export function fetchLastfmArtists(response) {
  const artists = [];
  const rawArtistList = get(response, 'results.artistmatches.artist', []);

  for (const artist of rawArtistList) {
    artists.push({
      name: artist.name,
      mbid: artist.mbid,
      url: artist.url,
      avatar: {
        sm: get(artist, 'image[1][#text]'),
        md: get(artist, 'image[2][#text]'),
        lg: get(artist, 'image[3][#text]'),
        xl: get(artist, 'image[4][#text]'),
      },
    });
  }
  return artists;
}

export function fetchDiscogsArtists(response) {
  return get(response, 'results', []).map((artist) => ({
    name: artist.title,
    discogsId: artist.id,
    url: `https://www.discogs.com${artist.uri}`,
    avatar: {
      sm: artist.thumb,
      md: artist.thumb,
      lg: artist.cover_image,
      xl: artist.cover_image,
    },
  }));
}
