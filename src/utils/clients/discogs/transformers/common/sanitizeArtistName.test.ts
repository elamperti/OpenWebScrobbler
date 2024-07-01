import { sanitizeArtistName } from './sanitizeArtistName';


describe('`sanitizeArtistName` helper', () => {
  it('removes trailing numbers added by Discogs', () => {
    expect(sanitizeArtistName('artist (123)')).toBe('artist');
  });

  it('keeps valid numbers from artist names', () => {
    expect(sanitizeArtistName('blink-182')).toBe('blink-182');
  });
});
