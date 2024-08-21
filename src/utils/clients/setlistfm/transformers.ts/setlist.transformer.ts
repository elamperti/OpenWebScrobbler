import { MusicalSet, SetTrack, Setlist, SetlistFmArtist } from 'utils/types/setlist';

export function setlistTransformer(raw: any) {
  return {
    id: raw?.id || null,
    versionId: raw?.versionId || null,
    eventDate: raw?.eventDate || null,
    artist: setlistArtistTransformer(raw?.artist),
    sets: setlistSetsTransformer(raw?.sets?.set),
    url: null,
  } as Setlist;
}
function setlistArtistTransformer(artist: any): SetlistFmArtist {
  return {
    name: artist?.name || artist?.sortName || '',
    mbid: artist?.mbid || null,
    url: artist?.url || '',
  } as SetlistFmArtist;
}

function setlistSetsTransformer(sets: any[]): MusicalSet[] {
  const listOfSets: MusicalSet[] = [];
  let counter = 1;
  for (const set of sets) {
    const newSet = {
      name: set.name || `Set #${counter}`,
      songs: setlistSongsTransformer(set.song),
    } as MusicalSet;
    counter = counter++;
    listOfSets.push(newSet);
  }
  return listOfSets;
}

function setlistSongsTransformer(songs: any[]): SetTrack[] {
  const listOfSongs: SetTrack[] = [];
  for (const song of songs) {
    const songTitle = song.name;
    let setTrack = { name: songTitle } as SetTrack;
    if ('cover' in song) {
      setTrack = {
        name: songTitle,
        originalArtist: {
          name: song.cover.name,
          mbid: song.cover.mbid,
          url: song.cover.url,
        } as SetlistFmArtist,
      } as SetTrack;
    }
    listOfSongs.push(setTrack);
  }
  return listOfSongs;
}
