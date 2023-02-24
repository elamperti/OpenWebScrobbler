import { sanitizeArtistName } from './sanitizeArtistName';

describe('the `sanitizeArtistName` function', () => {
  it('should sanitize artist name', () => {
    expect(sanitizeArtistName('artist (123)')).toEqual('artist');
  });
});
