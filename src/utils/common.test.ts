import { castArray, sanitizeProvider, sha256, usernameIsValid } from './common';

describe('`castArray` helper', () => {
  it('returns an array when given an array', () => {
    const arr = [1, 2, 3];
    expect(castArray(arr)).toEqual(arr);
  });

  it('returns an array with the given value when given a non-array value', () => {
    expect(castArray(1)).toEqual([1]);
    expect(castArray('hello')).toEqual(['hello']);
    expect(castArray({ foo: 'bar' })).toEqual([{ foo: 'bar' }]);
  });
});

describe('`usernameIsValid` helper', () => {
  it('returns true for valid usernames', () => {
    expect(usernameIsValid('xx')).toBe(true);
    expect(usernameIsValid('john_mayer')).toBe(true);
    expect(usernameIsValid('abcdefghij12345')).toBe(true);
    expect(usernameIsValid('the-slash')).toBe(true);
    expect(usernameIsValid('a1_b2-c3')).toBe(true);
  });

  it('returns false for invalid usernames', () => {
    expect(usernameIsValid('')).toBe(false);
    expect(usernameIsValid('1john_mayer')).toBe(false);
    expect(usernameIsValid('a')).toBe(false);
    expect(usernameIsValid('acbdef0123456789')).toBe(false);
    expect(usernameIsValid('-john_mayer')).toBe(false);
    expect(usernameIsValid('_john_mayer')).toBe(false);
  });
});

describe('`sanitizeProvider` helper', () => {
  it('returns the given provider when it is valid', () => {
    expect(sanitizeProvider('lastfm')).toBe('lastfm');
    expect(sanitizeProvider('discogs')).toBe('discogs');
    expect(sanitizeProvider('spotify')).toBe('spotify');
  });

  it('returns the default provider when an invalid string is received', () => {
    expect(sanitizeProvider('winamp')).toBe('discogs');
    expect(sanitizeProvider(undefined)).toBe('discogs');
  });

  it('returns a custom default provider when an invalid one is given', () => {
    expect(sanitizeProvider('winamp', 'lastfm')).toBe('lastfm');
  });
});

describe('`sha256` digest', () => {
  it('returns the correct SHA-256 hash for a given string', () => {
    const str = 'hello world';
    const expectedHash = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';
    sha256(str).then((hash) => expect(hash).toBe(expectedHash));
  });
});
