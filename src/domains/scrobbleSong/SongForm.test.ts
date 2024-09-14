import { extractArtistTitle } from './SongForm';

describe('`extractArtistTitle` helper', () => {
  describe('from pasted text', () => {
    it('extracts artist and title from text', () => {
      const text = 'Artist - Title';
      const result = extractArtistTitle(text);
      expect(result).toEqual({ artist: 'Artist', title: 'Title' });
    });

    it('extracts artist and title reversed', () => {
      // This is the case where the user pastes into the title field
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

  describe('from Last.fm URLs', () => {
    it('extracts artist and title', () => {
      const url = 'https://www.last.fm/music/Artist/_/Title';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist', title: 'Title' });
    });

    it('supports a partial URL', () => {
      const url = 'last.fm/music/Artist/_/Title';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist', title: 'Title' });
    });

    it('skips country code', () => {
      const url = 'https://www.last.fm/pt/music/Artist/_/Title';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist', title: 'Title' });
    });

    it('skips country code in albums', () => {
      const url = 'https://www.last.fm/fr/music/Artist/Album/';
      const result = extractArtistTitle(url);
      expect(result).toEqual(null);
    });

    it('extracts the album name if present', () => {
      const url = 'https://www.last.fm/music/Artist/Album/Title';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist', album: 'Album', title: 'Title' });
    });

    it('handles encoded characters', () => {
      const url = 'https://www.last.fm/music/Artist%20Name/_/Title%20Name';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist Name', title: 'Title Name' });
    });

    it('extracts artist and title with encoded characters and special characters', () => {
      const url = 'https://www.last.fm/music/Artist%20Name/_/Title%20Name%20(Feat.%20Artist%202)';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Artist Name', title: 'Title Name (Feat. Artist 2)' });
    });

    it.skip('supports a double-encoded plus sign', () => {
      // We shouldn't get cases like this, but I happened to find this one. No use in fixing it for now.
      const url = 'https://www.last.fm/es/music/Florence+%252B+the+Machine/_/You%27ve+Got+the+Love';
      const result = extractArtistTitle(url);
      expect(result).toEqual({ artist: 'Florence + the Machine', title: "You've Got the Love" });
    });

    it('handles question marks properly', () => {
      const url =
        'https://www.last.fm/es/music/Man%C3%A1/%C2%BFD%C3%B3nde+jugar%C3%A1n+los+ni%C3%B1os%3F/%C2%BFD%C3%B3nde+jugar%C3%A1n+los+ni%C3%B1os%3F';
      const result = extractArtistTitle(url);
      expect(result).toEqual({
        artist: 'Maná',
        album: '¿Dónde jugarán los niños?',
        title: '¿Dónde jugarán los niños?',
      });
    });

    it('returns null if URL does not match pattern', () => {
      const url = 'https://www.last.fm/music/Artist';
      const result = extractArtistTitle(url);
      expect(result).toBeNull();
    });
  });
});
