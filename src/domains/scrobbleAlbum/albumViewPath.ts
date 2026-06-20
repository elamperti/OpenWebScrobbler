import type { Album, BandcampAlbum, DiscogsAlbum, LastFmAlbum } from 'utils/types/album';

export function albumViewPath(album: Album): string {
  if ((album as LastFmAlbum).mbid) {
    return `/scrobble/album/view/mbid/${(album as LastFmAlbum).mbid}`;
  }
  if ((album as DiscogsAlbum).discogsId) {
    return `/scrobble/album/view/dsid/${(album as DiscogsAlbum).discogsId}`;
  }
  if ((album as BandcampAlbum).bandcampId) {
    // bandcampId is the full release URL, e.g. https://artistdomain.com/album/my-album or /track/my-song
    const bcUrl = new URL((album as BandcampAlbum).bandcampId);
    const [, releaseType, slug] = bcUrl.pathname.split('/');
    return `/scrobble/album/view/bc/${bcUrl.hostname}/${releaseType}/${slug}`;
  }
  const artist = album.artist ? encodeURIComponent(album.artist.replace('%', '')) : '_';
  return `/scrobble/album/view/${artist}/${encodeURIComponent(album.name.replace('%', ''))}`;
}
