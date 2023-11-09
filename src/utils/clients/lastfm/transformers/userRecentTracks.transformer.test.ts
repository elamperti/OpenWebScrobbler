import { userRecentTracksTransformer } from './userRecentTracks.transformer';

describe('userRecentTracksTransformer', () => {
  it('should return an object with the correct properties', () => {
    const response = {
      data: {
        recenttracks: {
          '@attr': {
            user: 'testuser',
            totalPages: '10',
          },
          track: [
            {
              artist: { '#text': 'Taylor Swift' },
              name: 'Blank Space',
              album: { '#text': '1989' },
              date: { uts: '1628760000' },
            },
            {
              artist: { '#text': 'Taylor Swift' },
              name: 'Shake It Off',
              album: { '#text': '1989' },
              date: { uts: '1628750000' },
            },
          ],
        },
      },
    };

    const expected = {
      username: 'testuser',
      totalPages: '10',
      scrobbles: [
        {
          artist: 'Taylor Swift',
          title: 'Shake It Off',
          album: '1989',
          albumArtist: null,
          timestamp: new Date(1628750000000),
        },
        {
          artist: 'Taylor Swift',
          title: 'Blank Space',
          album: '1989',
          albumArtist: null,
          timestamp: new Date(1628760000000),
        },
      ],
    };

    expect(userRecentTracksTransformer(response)).toEqual(expected);
  });

  it('should return a valid object when given an empty response', () => {
    const response = {};

    const expected = {
      username: '',
      totalPages: '',
      scrobbles: [],
    };

    expect(userRecentTracksTransformer(response)).toEqual(expected);
  });

  it('should return a valid object even if there are no tracks', () => {
    const response = {
      data: {
        recenttracks: {
          '@attr': {
            user: 'testuser',
            totalPages: '1',
          },
        },
      },
    };

    const expected = {
      username: 'testuser',
      totalPages: '1',
      scrobbles: [],
    };

    expect(userRecentTracksTransformer(response)).toEqual(expected);
  });

  it('should skip "now playing" tracks', () => {
    const response = {
      data: {
        recenttracks: {
          '@attr': {
            user: 'testuser',
            totalPages: '10',
          },
          track: [
            {
              artist: { '#text': 'Taylor Swift' },
              name: 'Blank Space',
              album: { '#text': '1989' },
              date: { uts: '1628760000' },
            },
            {
              artist: { '#text': 'Taylor Swift' },
              name: 'Shake It Off',
              album: { '#text': '1989' },
              date: { uts: '1628750000' },
              '@attr': {
                nowplaying: 'true',
              },
            },
          ],
        },
      },
    };

    const expected = {
      username: 'testuser',
      totalPages: '10',
      scrobbles: [
        {
          artist: 'Taylor Swift',
          title: 'Blank Space',
          album: '1989',
          albumArtist: null,
          timestamp: new Date(1628760000000),
        },
      ],
    };

    expect(userRecentTracksTransformer(response)).toEqual(expected);
  });
});
