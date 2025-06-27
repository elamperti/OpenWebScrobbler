export function userRecentTracksTransformer(response: any) {
  const tracks = [];
  const rawTrackList = response?.data?.recenttracks?.track ?? [];
  if (response?.data?.recenttracks?.track) {
    for (const item of rawTrackList) {
      if (!item?.['@attr']?.nowplaying) {
        tracks.push({
          artist: item.artist['#text'],
          title: item.name,
          album: item.album['#text'],
          albumArtist: null,
          timestamp: new Date(item.date.uts * 1000),
        });
      }
    }
  }

  const totalPagesValue = response?.data?.recenttracks?.['@attr']?.totalPages;
  return {
    username: response?.data?.recenttracks?.['@attr']?.user ?? '',
    totalPages: totalPagesValue ? parseInt(totalPagesValue, 10) : 0,
    scrobbles: tracks.reverse(),
  };
}
