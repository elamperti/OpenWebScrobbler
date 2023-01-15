import { albumSearchFormatter } from './album-search-response.formatter';

describe('the `albumSearchFormatter` function', () => {
  it('should format the results', () => {
    const results = albumSearchFormatter({
      data: {
        results: {
          albummatches: {
            album: [
              {
                name: 'title',
                artist: 'artist',
                mbid: '1',
                url: 'album.com',
                image: [
                  { '#text': 'images.com/sample' },
                  { '#text': 'images.com/sample-2' },
                  { '#text': 'images.com/thumb' },
                  { '#text': 'images.com/cover' },
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
          lg: 'images.com/cover',
          sm: 'images.com/thumb',
        },
        coverSizes: {
          lg: 300,
          sm: 174,
        },
        mbid: '1',
        name: 'title',
        url: 'album.com',
      },
    ]);
  });
});
