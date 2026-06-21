import { artistGetInfoTransformer } from './artistGetInfoResponse.transformer';

describe('Bandcamp transformer: artist getInfo', () => {
  it('maps discography items to BandcampAlbum', () => {
    const [album] = artistGetInfoTransformer({
      data: {
        discography: [
          {
            item_id: 2162872411,
            band_id: 3957198221,
            item_type: 'album',
            title: 'In Rainbows',
            artist_name: 'Radiohead',
            art_id: 552435637,
            item_url: 'https://radiohead.bandcamp.com/album/in-rainbows',
          },
        ],
      },
    });

    expect(album.bandId).toBe('3957198221');
    expect(album.tralbumId).toBe('2162872411');
    expect(album.tralbumType).toBe('a');
    expect(album.name).toBe('In Rainbows');
    expect(album.artist).toBe('Radiohead');
    expect(album.cover).toEqual({
      sm: 'https://f4.bcbits.com/img/a552435637_2.jpg',
      lg: 'https://f4.bcbits.com/img/a552435637_16.jpg',
    });
  });

  it('maps item_type "track" to tralbumType "t"', () => {
    const [album] = artistGetInfoTransformer({
      data: {
        discography: [{ item_id: 1, band_id: 2, item_type: 'track', title: 'A Track', band_name: 'Artist' }],
      },
    });
    expect(album.tralbumType).toBe('t');
  });

  it('nulls cover when art_id is missing', () => {
    const [album] = artistGetInfoTransformer({
      data: { discography: [{ item_id: 1, band_id: 2, item_type: 'album', title: 'X' }] },
    });
    expect(album.cover).toBeNull();
  });
});
