import type { Album, BandcampAlbum, DiscogsAlbum, LastFmAlbum } from 'utils/types/album';

export function albumViewPath(album: Album): string {
  if ((album as LastFmAlbum).mbid) {
    return `/scrobble/album/view/mbid/${(album as LastFmAlbum).mbid}`;
  }
  if ((album as DiscogsAlbum).discogsId) {
    return `/scrobble/album/view/dsid/${(album as DiscogsAlbum).discogsId}`;
  }
  const bc = album as BandcampAlbum;
  if (bc.bandId && bc.tralbumId) {
    return `/scrobble/album/view/bc/${bc.bandId}/${bc.tralbumType}/${bc.tralbumId}`;
  }
  const artist = album.artist ? encodeURIComponent(album.artist.replace('%', '')) : '_';
  return `/scrobble/album/view/${artist}/${encodeURIComponent(album.name.replace('%', ''))}`;
}
