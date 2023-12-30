import { topAlbumsTransformer } from './topAlbumsResponse.transformer';

describe('Last.fm transformer: top albums', () => {
  it('formats the results', () => {
    const results = topAlbumsTransformer({
      data: {
        topalbums: {
          album: [
            {
              name: 'title',
              artist: {
                name: 'artist',
              },
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
      },
    ]);
  });
});
