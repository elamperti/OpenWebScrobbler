import { albumSearchTransformer } from './albumSearchResponse.transformer';

describe('the `albumSearchTransformer` function', () => {
  it('should format the results', () => {
    const results = albumSearchTransformer({
      data: {
        results: {
          albummatches: {
            album: [
              {
                name: 'title',
                artist: 'artist',
                mbid: '1',
                url: 'example.com',
                image: [
                  { '#text': 'example.com/sample' },
                  { '#text': 'example.com/sample-2' },
                  { '#text': 'example.com/thumb' },
                  { '#text': 'example.com/cover' },
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
          lg: 'example.com/cover',
          sm: 'example.com/thumb',
        },
        coverSizes: {
          lg: 300,
          sm: 174,
        },
        mbid: '1',
        name: 'title',
        url: 'example.com',
      },
    ]);
  });
});
