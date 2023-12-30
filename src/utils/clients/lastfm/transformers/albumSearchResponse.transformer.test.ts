import { albumSearchTransformer } from './albumSearchResponse.transformer';

describe('Last.fm transformer: album search', () => {
  it('formats the results', () => {
    const results = albumSearchTransformer({
      data: {
        results: {
          albummatches: {
            album: [
              {
                name: 'title',
                artist: 'artist',
                mbid: '1',
                url: 'https://example.com',
                image: [
                  { '#text': 'https://example.com/sample' },
                  { '#text': 'https://example.com/sample-2' },
                  { '#text': 'https://example.com/thumb' },
                  { '#text': 'https://example.com/cover' },
                ],
              },
            ],
          },
        },
      },
    });

    expect(results).toEqual([
      {
        artist: 'artist',
        cover: {
          lg: 'https://example.com/cover',
          sm: 'https://example.com/thumb',
        },
        coverSizes: {
          lg: 300,
          sm: 174,
        },
        mbid: '1',
        name: 'title',
        url: 'https://example.com',
      },
    ]);
  });
});
