import { albumSearchTransformer } from './albumSearchResponse.transformer';

describe('Bandcamp transformer: album search', () => {
  it('formats album results and filters out non-album entries', () => {
    const results = albumSearchTransformer({
      data: {
        auto: {
          results: [
            {
              type: 'a',
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
        bandcampId: 'https://radiohead.bandcamp.com/album/in-rainbows',
        url: 'https://radiohead.bandcamp.com/album/in-rainbows',
        cover: {
          sm: 'https://f4.bcbits.com/img/a552435637_2.jpg',
          lg: 'https://f4.bcbits.com/img/a552435637_16.jpg',
        },
        coverSizes: { sm: 350, lg: 700 },
      },
    ]);
  });
});
