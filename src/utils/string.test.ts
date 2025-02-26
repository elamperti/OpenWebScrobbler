import { properCase, splitArtistTitleFromText } from './string';

describe('properCase', () => {
  it('handles empty strings', () => {
    expect(properCase('')).toBe('');
    expect(properCase('', true)).toBe('');
  });

  it('preserves already capitalized strings', () => {
    expect(properCase('The Quick Brown Fox')).toBe('The Quick Brown Fox');
    expect(properCase('TEST')).toBe('TEST');
  });

  it('capitalizes first letter of each word in normal mode', () => {
    expect(properCase('the quick brown fox')).toBe('The Quick Brown Fox');
    expect(properCase('hello world')).toBe('Hello World');
  });

  it('capitalizes only first letter in forceUcfirstMode', () => {
    expect(properCase('the quick brown fox', true)).toBe('The quick brown fox');
    expect(properCase('HELLO WORLD', true)).toBe('HELLO WORLD');
  });

  it('preserves special characters', () => {
    expect(properCase('hello-world')).toBe('Hello-World');
    expect(properCase('hello-world', true)).toBe('Hello-world');
    expect(properCase('hello & world')).toBe('Hello & World');
  });

  it('handles mixed case input', () => {
    expect(properCase('McDonald')).toBe('McDonald');
    expect(properCase('iPhone', true)).toBe('iPhone');
  });

  it('handles single word inputs', () => {
    expect(properCase('word')).toBe('Word');
    expect(properCase('WORD')).toBe('WORD');
    expect(properCase('word', true)).toBe('Word');
  });

  it('handles multiple spaces', () => {
    expect(properCase('the   quick  brown   fox')).toBe('The   Quick  Brown   Fox');
    expect(properCase('the   quick  brown   fox', true)).toBe('The   quick  brown   fox');
  });

  // The function should be improved for this case, maybe
  it.skip('handles non-ASCII characters', () => {
    expect(properCase('éèë')).toBe('Éèë');
    expect(properCase('éèë', true)).toBe('Éèë');
  });
});

describe('splitArtistTitleFromText', () => {
  it('splits artist and title correctly with default separator', () => {
    const text = 'Artist - Title';
    const result = splitArtistTitleFromText(text, false);
    expect(result).toEqual({ artist: 'Artist', title: 'Title' });
  });

  it('splits artist and title correctly with reverse option', () => {
    const text = 'Title - Artist';
    const result = splitArtistTitleFromText(text, true);
    expect(result).toEqual({ artist: 'Artist', title: 'Title' });
  });

  it('returns null if no separator is found', () => {
    const text = 'ArtistTitle';
    const result = splitArtistTitleFromText(text, false);
    expect(result).toBeNull();
  });

  it('skips splitting when there is one part missing', () => {
    const text = 'Artist -';
    const result = splitArtistTitleFromText(text, false);
    expect(result).toBeNull();
  });

  it('skips splitting when both parts are missing', () => {
    const text = '—';
    const result = splitArtistTitleFromText(text, false);
    expect(result).toBeNull();
  });

  it('breaks normal hyphen-minus (0x2D) when surrounded by spaces', () => {
    const text = 'X-ray Spex - The Day the World Turned Day-Glo';
    const result = splitArtistTitleFromText(text, false);
    expect(result).toEqual({ artist: 'X-ray Spex', title: 'The Day the World Turned Day-Glo' });
  });

  it('breaks normal nyphen with space only on the right', () => {
    const text = 'Alt-J- Breezeblocks';
    const result = splitArtistTitleFromText(text, false);
    expect(result).toEqual({ artist: 'Alt-J', title: 'Breezeblocks' });
  });

  it('breaks normal nyphen with space only on the left', () => {
    const text = 'Alt-J -Breezeblocks';
    const result = splitArtistTitleFromText(text, false);
    expect(result).toEqual({ artist: 'Alt-J', title: 'Breezeblocks' });
  });

  it('handles a fullwidth hyphen-minus (0xFF0D)', () => {
    const text = 'KST－我的未來還是夢';
    const result = splitArtistTitleFromText(text, false);
    expect(result).toEqual({ artist: 'KST', title: '我的未來還是夢' });
  });

  it('handles an en dash (0x2013)', () => {
    const text = 'The Kooks–Naive';
    const result = splitArtistTitleFromText(text, false);
    expect(result).toEqual({ artist: 'The Kooks', title: 'Naive' });
  });

  it('handles an em dash (0x2014)', () => {
    const text = 'Artist—Title';
    const result = splitArtistTitleFromText(text, false);
    expect(result).toEqual({ artist: 'Artist', title: 'Title' });
  });
});
