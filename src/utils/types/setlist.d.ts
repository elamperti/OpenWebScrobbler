type SetlistVenue = {
  name: string;
  city: string;
  state?: string;
  country: string;
};

export type Setlist = {
  id: string;
  date: Date;
  artist: string;
  tour: string;
  venue: SetlistVenue;
  trackCount: number;
  tracks?: MusicalSet[];
  url: string;
};
