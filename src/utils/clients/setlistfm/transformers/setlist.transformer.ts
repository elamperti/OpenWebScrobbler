import { parse } from 'date-fns';
import shortid from 'shortid';
import { setlistVenueTransformer } from './venue.transformer';

import type { Setlist } from 'utils/types/setlist';
import type { Track } from 'utils/types/track';

export function setlistTransformer(raw: any, withTracks: boolean): Setlist {
  const artist = raw?.artist?.name ?? 'Unknown';
  const tracks = Array.isArray(raw.sets?.set)
    ? raw.sets.set.map(({ song: rawSet }: any) => setlistTracklistTransformer(rawSet || [], artist)).flat()
    : undefined;

  return {
    id: raw.id,
    // ToDo: try to do something about the unknown time (use a default? fetch it from elsewhere?)
    date: parse(raw.eventDate, 'dd-MM-yyyy', new Date()),
    artist,
    tour: raw.tour?.name || '',
    venue: setlistVenueTransformer(raw?.venue),
    tracks: withTracks ? tracks : undefined,
    trackCount: tracks?.length ?? 0,
    url: raw.url || '',
  };
}

export function setlistTracklistTransformer(rawSet: any, artist: string): Track[] {
  if (!Array.isArray(rawSet)) return [];
  return (
    rawSet
      .filter(({ tape }) => !tape)
      .map(
        (song, i) =>
          ({
            id: shortid.generate(),
            trackNumber: i + 1,
            artist,
            title: song.name,
            album: '',
            albumArtist: '',
            duration: 0,
          }) as Track
      ) || []
  );
}
