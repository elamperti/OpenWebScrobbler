import type { SetlistVenue } from 'utils/types/setlist';

export function setlistVenueTransformer(venue: any): SetlistVenue {
  const city = venue?.city;
  return {
    name: venue.name || '',
    city: city.name || '',
    state: city.state || '',
    country: city?.country?.name || '',
  };
}
