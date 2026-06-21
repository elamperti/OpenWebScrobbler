import { albumGetInfoTransformer } from './albumGetInfoResponse.transformer';

describe('Bandcamp transformer: album getInfo', () => {
  it('formats the album info', () => {
    const info = albumGetInfoTransformer(
      {
        data: {
          artist: 'Radiohead',
          current: { title: 'In Rainbows' },
          art_id: 552435637,
          album_release_date: '07 Oct 2007 00:00:00 GMT',
          trackinfo: [{ track_num: 1 }, { track_num: 2 }],
        },
      },
      'https://radiohead.bandcamp.com/album/in-rainbows'
    );

    expect(info.name).toBe('In Rainbows');
    expect(info.artist).toBe('Radiohead');
    expect(info.bandcampId).toBe('https://radiohead.bandcamp.com/album/in-rainbows');
    expect(info.cover?.lg).toBe('https://f4.bcbits.com/img/a552435637_16.jpg');
    expect(info.releasedate).toBe('2007');
    expect(info.trackCount).toBe(2);
  });

  it('falls back to the current art_id when the top-level one is missing', () => {
    const info = albumGetInfoTransformer({
      data: { current: { title: 'In Rainbows', art_id: 552435637 } },
    });

    expect(info.cover?.sm).toBe('https://f4.bcbits.com/img/a552435637_2.jpg');
  });

  it('returns an empty album when the response has no data', () => {
    const info = albumGetInfoTransformer(undefined);

    expect(info.name).toBe('');
    expect(info.artist).toBe('');
    expect(info.cover).toBeNull();
    expect(info.coverSizes).toBeNull();
    expect(info.trackCount).toBe(0);
  });

  it('drops an unparseable release date', () => {
    const info = albumGetInfoTransformer({
      data: { current: { title: 'In Rainbows' }, album_release_date: 'not a date' },
    });

    expect(info.releasedate).toBeUndefined();
  });
});
