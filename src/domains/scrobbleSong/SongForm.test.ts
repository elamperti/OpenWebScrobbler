import { extractArtistTitle } from './SongForm';

describe('`extractArtistTitle` helper', () => {
  describe('`splitArtistTitleFromText` function', () => {
    it('extracts artist and title from text', () => {
      const text = 'Artist - Title';
      const result = extractArtistTitle(text);
      expect(result).toEqual({ artist: 'Artist', title: 'Title' });
    });

    it('extracts artist and title from text in reverse order', () => {
      const text = 'Title - Artist';
      const result = extractArtistTitle(text, true);
      expect(result).toEqual({ artist: 'Artist', title: 'Title' });
    });

    it('returns null if text does not match pattern', () => {
      const text = 'Invalid text';
      const result = extractArtistTitle(text);
      expect(result).toBeNull();
    });

    it('works with emdash', () => {
      const text = 'Artist — Title';
      const result = extractArtistTitle(text);
      expect(result).toEqual({ artist: 'Artist', title: 'Title' });
    });

    it('works with endash', () => {
      const text = 'Artist – Title';
      const result = extractArtistTitle(text);
      expect(result).toEqual({ artist: 'Artist', title: 'Title' });
    });

    it('works with emdash even without spaces around it', () => {
      const text = 'JAY-Z—4:44';
      const result = extractArtistTitle(text);
      expect(result).toEqual({ artist: 'JAY-Z', title: '4:44' });
    });
  });

  describe('`parseLastFmUrl` function', () => {
    it('extracts artist and title from Last.fm URL', () => {
      const url = 'https://www.last.fm/music/Artist/_/Title';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist', title: 'Title' });
    });

    it('extracts artist and title from Last.fm URL with country code', () => {
      const url = 'https://www.last.fm/pt/music/Artist/_/Title';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist', title: 'Title' });
    });

    it('extracts artist and title from Last.fm URL with encoded characters', () => {
      const url = 'https://www.last.fm/music/Artist%20Name/_/Title%20Name';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist Name', title: 'Title Name' });
    });

    it('extracts artist and title from Last.fm URL with encoded characters and special characters', () => {
      const url = 'https://www.last.fm/music/Artist%20Name/_/Title%20Name%20(Feat.%20Artist%202)';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist Name', title: 'Title Name (Feat. Artist 2)' });
    });

    it('extracts artist and title from Last.fm URL with encoded characters, special characters and multiple dashes', () => {
      const url = 'https://www.last.fm/music/Artist%20Name/_/Title%20Name%20(Feat.%20Artist%202)%20-%20Remix';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist Name', title: 'Title Name (Feat. Artist 2) - Remix' });
    });

    it('returns null if URL does not match pattern', () => {
      const url = 'https://www.last.fm/music/Artist';
      const result = extractArtistTitle(url);
      expect(result).toBeNull();
    });
  });
});
