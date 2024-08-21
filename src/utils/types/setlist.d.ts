type SetlistFmArtist = {
  name: string;
  mbid: string;
  url: string;
};

type Song = {
  name: string;
};

type Cover = Song & {
  originalArtist: SetlistFmArtist;
};

type SetTrack = Song | Cover;

type MusicalSet = {
  name: string;
  songs: SetTrack[];
};

export type Setlist = {
  id: string;
  versionId: string;
  eventDate: Date;
  artist: SetlistFmArtist;
  sets: MusicalSet[];
  url: string;
};
