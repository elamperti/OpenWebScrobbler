import { formatDuration, formatScrobbleTimestamp } from './datetime';

describe('`formatDuration` helper', () => {
  it('is correct', () => {
    expect(formatDuration(45)).toEqual('0:45');
    expect(formatDuration(150)).toEqual('2:30');
    expect(formatDuration(3801)).toEqual('1:03:21');
  });

  it('handles durations over 13 hours', () => {
    expect(formatDuration(13 * 3600 + 5)).toEqual('13:00:05');
  });

  it('handles durations over 25 hours', () => {
    expect(formatDuration(25 * 3600 + 3)).toEqual('1:00:03');
  });
});

describe('`formatScrobbleTimestamp` helper', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('24-hour format', () => {
    it('formats today, same year and previous year timestamps', () => {
      const today = new Date('2025-06-15T09:30:00');
      const sameYear = new Date('2025-02-01T17:05:00');
      const prevYear = new Date('2024-12-31T23:59:00');

      expect(formatScrobbleTimestamp(today, false)).toBe('09:30');
      expect(formatScrobbleTimestamp(sameYear, false)).toBe('1/02 17:05');
      expect(formatScrobbleTimestamp(prevYear, false)).toBe('31/12/2024 23:59');
    });
  });

  describe('12-hour format', () => {
    it('formats same year and previous year timestamps', () => {
      const sameYear = new Date('2025-02-01T17:05:00');
      const prevYear = new Date('2024-12-31T17:05:00');

      expect(formatScrobbleTimestamp(sameYear, true)).toBe('2/1 05:05 PM');
      expect(formatScrobbleTimestamp(prevYear, true)).toBe('12/31/2024 05:05 PM');
    });
  });
});
