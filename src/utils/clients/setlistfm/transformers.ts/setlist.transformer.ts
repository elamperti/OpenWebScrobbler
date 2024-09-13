import { MusicalSet, SetTrack, Setlist, Venue } from 'utils/types/setlist';
import { SetlistFmArtist } from 'utils/types/artist';
import { parse } from 'date-fns';

export function setlistTransformer(raw: any) {
  const dateString = raw?.eventDate || null;
  let date = null;
  if (dateString) {
    date = parse(dateString, 'dd-MM-yyyy', new Date());
  }
  return {
    id: raw?.id || null,
    versionId: raw?.versionId || null,
    eventDate: date,
    artist: setlistArtistTransformer(raw?.artist),
    venue: setlistVenueTransformer(raw?.venue),
    tour: raw?.tour?.name || null,
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

function setlistVenueTransformer(venue: any): Venue {
  const city = venue?.city;
  return {
    id: venue?.id,
    name: venue?.name || '',
    city: city?.name || null,
    state: city?.state || null,
    country: city?.country?.name || null,
  } as Venue;
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
