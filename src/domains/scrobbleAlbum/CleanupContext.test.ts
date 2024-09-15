import { cleanTitleWithPattern, breakStringUsingPattern, strToCleanupPattern } from './CleanupContext';

describe('cleanTitleWithPattern', () => {
  it('removes pattern from title', () => {
    const title = 'Song Title live';
    const pattern = strToCleanupPattern('LIVE');
    expect(cleanTitleWithPattern(title, pattern)).toBe('Song Title');
  });

  it('returns the original title if pattern is not found', () => {
    const title = 'Song Title (live)';
    const pattern = strToCleanupPattern('remix');
    expect(cleanTitleWithPattern(title, pattern)).toBe('Song Title (live)');
  });

  it('returns the original title if pattern is null', () => {
    const title = 'Song Title (2024)';
    expect(cleanTitleWithPattern(title, null)).toBe('Song Title (2024)');
  });

  it('skips patterns of less than 3 characters', () => {
    const title = 'Song Title (20)';
    const pattern = strToCleanupPattern('20');
    expect(cleanTitleWithPattern(title, pattern)).toBe('Song Title (20)');
  });

  it('removes trailing dashes', () => {
    const title = 'Song Title - Live';
    const pattern = strToCleanupPattern('live');
    expect(cleanTitleWithPattern(title, pattern)).toBe('Song Title');
  });

  it('removes empty parenthesis', () => {
    const title = 'Song Title (remix)';
    const pattern = strToCleanupPattern('remix');
    expect(cleanTitleWithPattern(title, pattern)).toBe('Song Title');
  });

  it('removes empty brackets', () => {
    const title = 'Song Title [fOoB4r]';
    const pattern = strToCleanupPattern('fOoB4r');
    expect(cleanTitleWithPattern(title, pattern)).toBe('Song Title');
  });

  it("doesn't match partial end of words", () => {
    const title = 'Song Title remix';
    const pattern = strToCleanupPattern('mix');
    expect(cleanTitleWithPattern(title, pattern)).toBe('Song Title remix');
  });

  it("doesn't match partial beginning of words", () => {
    const title = 'Love (Sweet Love) (Dopamine Remix)';
    const pattern = strToCleanupPattern('dopa');
    expect(cleanTitleWithPattern(title, pattern)).toBe(title);
  });

  it('auto-closes parenthesis', () => {
    const title = 'Song Title (remix) [1984]';
    const pattern = strToCleanupPattern('(remix');
    expect(cleanTitleWithPattern(title, pattern)).toBe('Song Title [1984]');
  });

  it('auto-closes brackets', () => {
    const title = 'Song Title (remix) [1984]';
    const pattern = strToCleanupPattern('[1984');
    expect(cleanTitleWithPattern(title, pattern)).toBe('Song Title (remix)');
  });

  it('matches words starting with symbols', () => {
    const title = 'Song Title $remix';
    const pattern = strToCleanupPattern('$remix');
    expect(cleanTitleWithPattern(title, pattern)).toBe('Song Title');
  });

  it('supports several words in the pattern', () => {
    const title = "I can't quit you baby - Live in paris, 1969";
    const pattern = strToCleanupPattern('live in paris, 1969');
    expect(cleanTitleWithPattern(title, pattern)).toBe("I can't quit you baby");
  });
});

describe('breakStringUsingPattern', () => {
  it('breaks down the string into parts matching the pattern', () => {
    const str = 'Song Title (remix) (live) (2024)';
    const pattern = /\(remix\)|\(live\)|\(2024\)/gi;
    const result = breakStringUsingPattern(str, pattern);
    expect(result).toEqual([
      { value: 'Song Title', isMatch: false },
      { value: ' (remix)', isMatch: true },
      { value: ' (live)', isMatch: true },
      { value: ' (2024)', isMatch: true },
    ]);
  });

  it('marks extra spaces', () => {
    const str = 'Song Title (remix) - More';
    const pattern = /\(remix\)/gi;
    const result = breakStringUsingPattern(str, pattern);
    expect(result).toEqual([
      { value: 'Song Title', isMatch: false },
      { value: ' (remix)', isMatch: true },
      { value: ' - More', isMatch: false },
    ]);
  });

  it('returns the whole string as non-matching if pattern is not found', () => {
    const str = 'Song Title (remix)';
    const pattern = /\(live\)/gi;
    const result = breakStringUsingPattern(str, pattern);
    expect(result).toEqual([{ value: 'Song Title (remix)', isMatch: false }]);
  });

  it('returns the whole string as non-matching if pattern is null', () => {
    const str = 'Song Title (2024)';
    const result = breakStringUsingPattern(str, null);
    expect(result).toEqual([{ value: 'Song Title (2024)', isMatch: false }]);
  });

  it('returns an empty array if the string is empty', () => {
    const str = '';
    const pattern = /\(remix\)/gi;
    const result = breakStringUsingPattern(str, pattern);
    expect(result).toEqual([]);
  });
});
