import { artistsSearchTransformer } from './artistsSearchResponse.transformer';

describe('Bandcamp transformer: artist search', () => {
  it('formats the results and derives the domain from the url', () => {
    const results = artistsSearchTransformer({
      data: {
        auto: {
          results: [
            {
              type: 'b',
              name: 'Radiohead',
              item_url_root: 'https://radiohead.bandcamp.com',
              img: 'https://example.com/img.jpg',
            },
          ],
        },
      },
    });

    expect(results).toEqual([
      {
        name: 'Radiohead',
        bandcampDomain: 'radiohead.bandcamp.com',
        url: 'https://radiohead.bandcamp.com',
        avatar: {
          sm: 'https://example.com/img.jpg',
          md: 'https://example.com/img.jpg',
          lg: 'https://example.com/img.jpg',
          xl: 'https://example.com/img.jpg',
        },
      },
    ]);
  });

  it('filters out non-band entries and bands without a url', () => {
    const results = artistsSearchTransformer({
      data: {
        auto: {
          results: [
            { type: 'a', name: 'An album', item_url_root: 'https://x.bandcamp.com' },
            { type: 'b', name: 'No url' },
          ],
        },
      },
    });

    expect(results).toEqual([]);
  });

  it('returns an empty array when there are no results', () => {
    expect(artistsSearchTransformer({})).toEqual([]);
  });
});
