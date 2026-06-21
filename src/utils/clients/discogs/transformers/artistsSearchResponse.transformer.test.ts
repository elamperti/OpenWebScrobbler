import { artistsSearchTransformer } from './artistsSearchResponse.transformer';

describe('Discogs transformer: artist search', () => {
  it('formats the results', () => {
    const results = artistsSearchTransformer({
      data: {
        results: [
          {
            id: 42,
            title: 'Radiohead',
            uri: '/artist/3840-Radiohead',
            thumb: 'https://example.com/thumb',
            cover_image: 'https://example.com/cover',
          },
        ],
      },
    });

    expect(results).toEqual([
      {
        name: 'Radiohead',
        discogsId: 42,
        url: 'https://www.discogs.com/artist/3840-Radiohead',
        avatar: {
          sm: 'https://example.com/thumb',
          md: 'https://example.com/thumb',
          lg: 'https://example.com/cover',
          xl: 'https://example.com/cover',
        },
      },
    ]);
  });

  it('sanitizes the artist name', () => {
    const results = artistsSearchTransformer({
      data: { results: [{ id: 1, title: 'Air (2)', uri: '/artist/1' }] },
    });

    expect(results[0].name).toBe('Air');
  });

  it('returns a null url when uri is missing', () => {
    const results = artistsSearchTransformer({
      data: { results: [{ id: 1, title: 'Radiohead' }] },
    });

    expect(results[0].url).toBeNull();
  });

  it('returns an empty array when there are no results', () => {
    expect(artistsSearchTransformer({})).toEqual([]);
  });
});
