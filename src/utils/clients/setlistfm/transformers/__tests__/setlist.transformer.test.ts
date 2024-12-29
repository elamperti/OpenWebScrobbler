import { setlistTransformer, setlistTracklistTransformer } from '../setlist.transformer';

const mockSetlistData = {
  id: '6ba88aa6',
  eventDate: '14-11-2024',
  artist: {
    name: 'Keane',
  },
  venue: {
    name: 'Movistar Arena',
    city: {
      name: 'Buenos Aires',
      state: 'Autonomous City of Buenos Aires',
      country: {
        code: 'AR',
        name: 'Argentina',
      },
    },
  },
  tour: {
    name: 'Hopes and Fears 20th Anniversary Tour',
  },
  sets: {
    set: [
      {
        song: [
          { name: "Can't Stop Now" },
          { name: 'Silenced by the Night' },
          { name: 'Bend and Break' },
          { name: 'Snowed Under', info: 'Dedicated to Laura from the audience' },
          { name: 'This Is the Last Time', tape: true }, // Should be skipped
          { name: 'Crystal Ball' },
        ],
      },
      {
        encore: 1,
        song: [
          {
            name: 'Disconnected',
          },
          {
            name: 'Under Pressure',
            cover: {
              mbid: '25f54bb7-c393-44e4-8e26-e4f4cd7aa61c',
              name: 'Queen & David Bowie',
              sortName: 'Queen & Bowie, David',
              disambiguation: '',
              url: 'https://www.setlist.fm/setlists/queen-and-david-bowie-6bd6ee46.html',
            },
          },
          {
            name: 'We Might as Well Be Strangers',
          },
          {
            name: 'Bedshaped',
          },
        ],
      },
    ],
  },
  url: 'https://www.setlist.fm/setlist/keane/2024/movistar-arena-buenos-aires-argentina-6ba88aa6.html',
};

describe('setlistTransformer', () => {
  it('transforms basic setlist data correctly', () => {
    const result = setlistTransformer(mockSetlistData, false);

    expect(result).toEqual({
      id: '6ba88aa6',
      date: new Date(2024, 10, 14, 0, 0, 0, 0),
      artist: 'Keane',
      tour: 'Hopes and Fears 20th Anniversary Tour',
      venue: {
        name: 'Movistar Arena',
        city: 'Buenos Aires',
        state: 'Autonomous City of Buenos Aires',
        country: 'Argentina',
      },
      tracks: undefined,
      trackCount: 9,
      url: mockSetlistData.url,
    });
  });

  it('transforms setlist with tracks when withTracks is true', () => {
    const result = setlistTransformer(mockSetlistData, true);

    expect(result.tracks).toHaveLength(9); // 7 total - 1 tape track
    expect(result.tracks?.[0]).toEqual({
      id: expect.any(String),
      trackNumber: 1,
      artist: 'Keane',
      title: "Can't Stop Now",
      album: '',
      albumArtist: '',
      duration: 0,
    });
  });

  it('handles empty sets correctly', () => {
    const emptySetlist = { ...mockSetlistData, sets: { set: [] } };
    const result = setlistTransformer(emptySetlist, true);

    expect(result.tracks).toEqual([]);
    expect(result.trackCount).toBe(0);
  });

  it('handles missing artist name', () => {
    const noArtist = { ...mockSetlistData, artist: {} };
    const result = setlistTransformer(noArtist, false);

    expect(result.artist).toBe('Unknown');
  });

  it('handles missing tour name', () => {
    const noTour = { ...mockSetlistData, tour: null };
    const result = setlistTransformer(noTour, false);

    expect(result.tour).toBe('');
  });
});

describe('setlistTracklistTransformer', () => {
  const artist = 'Keane';

  it('transforms a list of tracks correctly', () => {
    const rawTracks = [{ name: "Can't Stop Now" }, { name: 'Silenced by the Night' }];

    const result = setlistTracklistTransformer(rawTracks, artist);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: expect.any(String),
      trackNumber: 1,
      artist: 'Keane',
      title: "Can't Stop Now",
      album: '',
      albumArtist: '',
      duration: 0,
    });
  });

  it('filters out tape tracks', () => {
    const rawTracks = [{ name: 'Track 1' }, { name: 'Track 2', tape: true }, { name: 'Track 3' }];

    const result = setlistTracklistTransformer(rawTracks, artist);

    expect(result).toHaveLength(2);
    expect(result.map((t) => t.title)).toEqual(['Track 1', 'Track 3']);
  });

  it('handles empty input', () => {
    expect(setlistTracklistTransformer([], artist)).toEqual([]);
  });

  it('handles invalid input', () => {
    expect(setlistTracklistTransformer(null, artist)).toEqual([]);
    expect(setlistTracklistTransformer(undefined, artist)).toEqual([]);
    expect(setlistTracklistTransformer({}, artist)).toEqual([]);
  });

  it('assigns sequential track numbers', () => {
    const rawTracks = [
      { name: 'First' },
      { name: 'Second', tape: true }, // This one should be skipped
      { name: 'Third' },
      { name: 'Fourth' },
    ];

    const result = setlistTracklistTransformer(rawTracks, artist);

    expect(result.map((t) => t.trackNumber)).toEqual([1, 2, 3]);
  });

  it('handles cover songs', () => {
    const rawTracks = [
      {
        name: 'Under Pressure',
        cover: {
          name: 'Queen & David Bowie',
        },
      },
    ];

    const result = setlistTracklistTransformer(rawTracks, artist);

    expect(result[0]).toEqual({
      id: expect.any(String),
      trackNumber: 1,
      artist: 'Keane',
      title: 'Under Pressure',
      album: '',
      albumArtist: '',
      duration: 0,
    });
  });
});
