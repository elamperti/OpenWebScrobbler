import { SetlistFmArtist } from 'utils/types/artist';

type Song = {
  name: string;
  tape: boolean;
};

type Cover = Song & {
  originalArtist: SetlistFmArtist;
};

type SetTrack = Song | Cover;

type MusicalSet = {
  name: string;
  songs: SetTrack[];
};

type Venue = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
};

export type Setlist = {
  id: string;
  versionId: string;
  eventDate: Date;
  artist: SetlistFmArtist;
  tour: string;
  venue: Venue;
  sets: MusicalSet[];
  url: string;
};
