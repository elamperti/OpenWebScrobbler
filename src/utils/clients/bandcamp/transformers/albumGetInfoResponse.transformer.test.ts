import { albumGetInfoTransformer } from './albumGetInfoResponse.transformer';

describe('Bandcamp transformer: album getInfo', () => {
  it('formats the album info from mobile shape', () => {
    const info = albumGetInfoTransformer(
      {
        data: {
          tralbum_artist: 'Radiohead',
          title: 'In Rainbows',
          art_id: 552435637,
          release_date: 1191715200, // 2007-10-07 in unix seconds
          bandcamp_url: 'https://radiohead.bandcamp.com/album/in-rainbows',
          tracks: [{ track_num: 1 }, { track_num: 2 }],
        },
      },
      '3957198221',
      'a',
      '2162872411'
    );

    expect(info.name).toBe('In Rainbows');
    expect(info.artist).toBe('Radiohead');
    expect(info.bandId).toBe('3957198221');
    expect(info.tralbumId).toBe('2162872411');
    expect(info.tralbumType).toBe('a');
    expect(info.url).toBe('https://radiohead.bandcamp.com/album/in-rainbows');
    expect(info.cover?.lg).toBe('https://f4.bcbits.com/img/a552435637_16.jpg');
    expect(info.releasedate).toBe('2007');
    expect(info.trackCount).toBe(2);
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
      data: { title: 'In Rainbows', release_date: null },
    });

    expect(info.releasedate).toBeUndefined();
  });
});
