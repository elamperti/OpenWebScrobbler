import { albumSearchTransformer } from './albumSearchResponse.transformer';

describe('Bandcamp transformer: album search', () => {
  it('formats album results and filters out non-album entries', () => {
    const results = albumSearchTransformer({
      data: {
        auto: {
          results: [
            {
              type: 'a',
              id: 2162872411,
              band_id: 3957198221,
              name: 'In Rainbows',
              band_name: 'Radiohead',
              art_id: 552435637,
              item_url_path: 'https://radiohead.bandcamp.com/album/in-rainbows',
              img: 'https://f4.bcbits.com/img/a552435637_9.jpg',
            },
            { type: 'b', name: 'Not an album', band_name: 'Radiohead' },
          ],
        },
      },
    });

    expect(results).toEqual([
      {
        artist: 'Radiohead',
        name: 'In Rainbows',
        bandId: '3957198221',
        tralbumId: '2162872411',
        tralbumType: 'a',
        url: '/scrobble/album/view/bc/3957198221/a/2162872411',
        cover: {
          sm: 'https://f4.bcbits.com/img/a552435637_2.jpg',
          lg: 'https://f4.bcbits.com/img/a552435637_16.jpg',
        },
        coverSizes: { sm: 350, lg: 700 },
      },
    ]);
  });

  it('filters out album entries missing a name, bandId, or tralbumId', () => {
    const results = albumSearchTransformer({
      data: {
        auto: {
          results: [
            { type: 'a', id: 1, band_id: 2, band_name: 'Radiohead' }, // no name
            { type: 'a', band_id: 2, name: 'No id', band_name: 'Radiohead' }, // no id
            { type: 'a', id: 1, name: 'No band_id', band_name: 'Radiohead' }, // no band_id
          ],
        },
      },
    });

    expect(results).toEqual([]);
  });
});
