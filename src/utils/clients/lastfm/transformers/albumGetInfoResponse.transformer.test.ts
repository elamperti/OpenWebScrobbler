import { albumGetInfoTransformer } from './albumGetInfoResponse.transformer';

describe('`albumGetInfoTransformer` function', () => {
  it('formats the response', () => {
    const results = albumGetInfoTransformer({
      data: {
        album: {
          name: 'title',
          artist: 'artist',
          mbid: '1234',
          url: 'example.com',
          releasedate: '2022',
          image: [
            { '#text': 'example.com/sample' },
            { '#text': 'example.com/sample-2' },
            { '#text': 'example.com/thumb' },
            { '#text': 'example.com/cover' },
          ],
        },
      },
    });

    expect(results).toEqual({
      artist: 'artist',
      releasedate: '2022',
      mbid: '1234',
      cover: {
        lg: 'example.com/cover',
        sm: 'example.com/thumb',
      },
      coverSizes: {
        lg: 300,
        sm: 174,
      },
      name: 'title',
      url: 'example.com',
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
