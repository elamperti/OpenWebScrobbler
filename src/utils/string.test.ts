import { splitArtistTitleFromText } from './string';

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

  it('breaks normal hyphen-minus (0x2D) only when surrounded by spaces', () => {
    const text = 'Alt-J - Breezeblocks';
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
