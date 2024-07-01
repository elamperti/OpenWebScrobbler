import { albumGetInfoTransformer } from './albumGetInfoResponse.transformer';


describe('Last.fm transformer: album info', () => {
  it('formats the response', () => {
    const results = albumGetInfoTransformer({
      data: {
        album: {
          name: 'title',
          artist: 'artist',
          mbid: '1234',
          url: 'https://example.com',
          releasedate: '2022',
          image: [
            { '#text': 'https://example.com/sample' },
            { '#text': 'https://example.com/sample-2' },
            { '#text': 'https://example.com/thumb' },
            { '#text': 'https://example.com/cover' },
          ],
        },
      },
    });

    expect(results).toEqual({
      artist: 'artist',
      releasedate: '2022',
      mbid: '1234',
      cover: {
        lg: 'https://example.com/cover',
        sm: 'https://example.com/thumb',
      },
      coverSizes: {
        lg: 300,
        sm: 174,
      },
      name: 'title',
      url: 'https://example.com',
      trackCount: 0,
    });
  });

  it('includes mbid when provided', () => {
    const results = albumGetInfoTransformer(
      {
        data: {
          album: {
            name: 'title',
            artist: 'artist',
            mbid: '1234',
          },
        },
      },
      'my-very-special-mbid'
    );

    expect(results).toHaveProperty('mbid', 'my-very-special-mbid');
  });

  it('leaves mbid undefined when not provided', () => {
    const results = albumGetInfoTransformer({
      data: {
        album: {
          name: 'title',
          artist: 'artist',
        },
      },
    });

    expect(results).toHaveProperty('mbid', undefined);
  });

  it('handles missing albums', () => {
    const results = albumGetInfoTransformer({ message: 'Album not found', error: 6 });

    expect(results).toBeNull();
  });
});
