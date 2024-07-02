import { extractArtistTitle } from './SongForm';


describe('`extractArtistTitle` helper', () => {
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
