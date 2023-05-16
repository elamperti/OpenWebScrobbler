import { castArray, usernameIsValid } from './common';

describe('castArray', () => {
  it('should return an array when given an array', () => {
    const arr = [1, 2, 3];
    expect(castArray(arr)).toEqual(arr);
  });

  it('should return an array with the given value when given a non-array value', () => {
    expect(castArray(1)).toEqual([1]);
    expect(castArray('hello')).toEqual(['hello']);
    expect(castArray({ foo: 'bar' })).toEqual([{ foo: 'bar' }]);
  });
});

describe('usernameIsValid', () => {
  it('should return true for valid usernames', () => {
    expect(usernameIsValid('xx')).toBe(true);
    expect(usernameIsValid('john_mayer')).toBe(true);
    expect(usernameIsValid('abcdefghij12345')).toBe(true);
    expect(usernameIsValid('the-slash')).toBe(true);
    expect(usernameIsValid('a1_b2-c3')).toBe(true);
  });

  it('should return false for invalid usernames', () => {
    expect(usernameIsValid('')).toBe(false);
    expect(usernameIsValid('1john_mayer')).toBe(false);
    expect(usernameIsValid('a')).toBe(false);
    expect(usernameIsValid('acbdef0123456789')).toBe(false);
    expect(usernameIsValid('-john_mayer')).toBe(false);
    expect(usernameIsValid('_john_mayer')).toBe(false);
  });
});
