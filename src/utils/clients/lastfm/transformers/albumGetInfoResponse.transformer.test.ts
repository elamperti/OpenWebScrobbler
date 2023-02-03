import { albumGetInfoTransformer } from './albumGetInfoResponse.transformer';

describe('the `albumGetInfoTransformer` function', () => {
  it('should format the results', () => {
    const results = albumGetInfoTransformer({
      data: {
        album: {
          name: 'title',
          artist: 'artist',
          mbid: '1',
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
    });
  });
});
