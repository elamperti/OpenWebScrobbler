import { prepareScrobbles } from './scrobbleTransformer';

import type { Scrobble } from 'utils/types/scrobble';

describe('prepareScrobbles', () => {
  const mockDate = new Date('2025-05-17T12:00:00.000Z');

  it('transforms a single scrobble correctly', () => {
    const input: Partial<Scrobble>[] = [
      {
        artist: 'Olivia Rodrigo',
        title: 'good 4 u',
        album: 'SOUR',
        albumArtist: 'Hayley Williams',
        timestamp: mockDate,
      },
    ];

    const result = prepareScrobbles(input);

    expect(result).toEqual({
      artist: ['Olivia Rodrigo'],
      track: ['good 4 u'],
      album: ['SOUR'],
      albumArtist: ['Hayley Williams'],
      timestamp: [mockDate.toISOString()],
    });
  });

  it('transforms multiple scrobbles correctly', () => {
    const input: Partial<Scrobble>[] = [
      {
        artist: 'Taylor Swift',
        title: 'I Know Places',
        album: '1989',
        albumArtist: 'Taylor Swift',
        timestamp: mockDate,
      },
      {
        artist: 'Mitski',
        title: 'Francis Forever',
        album: 'Bury Me at Makeout Creek',
        albumArtist: 'Mitski',
        timestamp: new Date(mockDate.getTime() + 1000), // 1 second later
      },
    ];

    const result = prepareScrobbles(input);

    expect(result).toEqual({
      artist: ['Taylor Swift', 'Mitski'],
      track: ['I Know Places', 'Francis Forever'],
      album: ['1989', 'Bury Me at Makeout Creek'],
      albumArtist: ['Taylor Swift', 'Mitski'],
      timestamp: ['2025-05-17T12:00:00.000Z', '2025-05-17T12:00:01.000Z'],
    });
  });

  it('handles missing optional fields', () => {
    const input: Partial<Scrobble>[] = [
      {
        artist: 'Olivia Rodrigo',
        title: 'good 4 u',
        timestamp: mockDate,
      },
    ];

    const result = prepareScrobbles(input);

    expect(result).toEqual({
      artist: ['Olivia Rodrigo'],
      track: ['good 4 u'],
      album: [''],
      albumArtist: [''],
      timestamp: [mockDate.toISOString()],
    });
  });
});
