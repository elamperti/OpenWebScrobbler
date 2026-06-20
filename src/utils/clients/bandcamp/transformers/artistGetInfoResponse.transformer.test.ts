import { artistGetInfoTransformer } from './artistGetInfoResponse.transformer';

describe('Bandcamp transformer: artist getInfo', () => {
  it('rebuilds sm/lg cover from the art id in art_url', () => {
    const [album] = artistGetInfoTransformer(
      { data: { releases: [{ page_url: '/album/in-rainbows', title: 'In Rainbows', art_url: 'https://f4.bcbits.com/img/a552435637_2.jpg' }] } },
      'radiohead.bandcamp.com'
    );

    expect(album.cover).toEqual({
      sm: 'https://f4.bcbits.com/img/a552435637_2.jpg',
      lg: 'https://f4.bcbits.com/img/a552435637_16.jpg',
    });
    expect(album.url).toBe('https://radiohead.bandcamp.com/album/in-rainbows');
  });

  it('nulls cover when art_url is missing', () => {
    const [album] = artistGetInfoTransformer(
      { data: { releases: [{ page_url: '/album/x', title: 'X' }] } },
      'radiohead.bandcamp.com'
    );
    expect(album.cover).toBeNull();
  });
});
