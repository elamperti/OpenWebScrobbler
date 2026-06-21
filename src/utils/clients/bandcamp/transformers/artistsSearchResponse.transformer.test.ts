import { artistsSearchTransformer } from './artistsSearchResponse.transformer';

describe('Bandcamp transformer: artist search', () => {
  it('formats the results and exposes bandId', () => {
    const results = artistsSearchTransformer({
      data: {
        auto: {
          results: [
            {
              type: 'b',
              id: 3957198221,
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
        bandId: '3957198221',
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

  it('filters out non-band entries and bands without a url or id', () => {
    const results = artistsSearchTransformer({
      data: {
        auto: {
          results: [
            { type: 'a', id: 1, name: 'An album', item_url_root: 'https://x.bandcamp.com' },
            { type: 'b', name: 'No url', id: 2 },
            { type: 'b', name: 'No id', item_url_root: 'https://x.bandcamp.com' },
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
