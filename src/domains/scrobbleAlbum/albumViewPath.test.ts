import { albumViewPath } from './albumViewPath';

import type { Album, BandcampAlbum, DiscogsAlbum, LastFmAlbum } from 'utils/types/album';

describe('albumViewPath', () => {
  it('builds an mbid path', () => {
    expect(albumViewPath({ mbid: 'abc' } as LastFmAlbum)).toBe('/scrobble/album/view/mbid/abc');
  });

  it('builds a discogs path', () => {
    expect(albumViewPath({ discogsId: 42 } as unknown as DiscogsAlbum)).toBe('/scrobble/album/view/dsid/42');
  });

  it('builds a bandcamp path', () => {
    const album = { bandId: '1', tralbumId: '2', tralbumType: 'a' } as BandcampAlbum;
    expect(albumViewPath(album)).toBe('/scrobble/album/view/bc/1/a/2');
  });

  it('falls back to artist/name and strips % chars', () => {
    expect(albumViewPath({ artist: 'A%B', name: 'C%D' } as Album)).toBe('/scrobble/album/view/AB/CD');
  });

  it('uses _ when artist is missing', () => {
    expect(albumViewPath({ name: 'Name' } as Album)).toBe('/scrobble/album/view/_/Name');
  });
});
