import type { DiscogsArtist, LastFmArtist } from 'utils/types/artist';

import { useQuery } from '@tanstack/react-query';
import Spinner from 'components/Spinner';
import { PROVIDER_DISCOGS, PROVIDER_LASTFM, Provider } from 'Constants';
import ReactGA from 'react-ga-neo';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { searchArtists as DiscogsSearch } from 'utils/clients/discogs';
import { searchArtists as LastFmSearch } from 'utils/clients/lastfm';

import ArtistList from './ArtistList';


export default function ArtistResults({ query, dataProvider }: { query: string; dataProvider: Provider }) {
  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ['artists', dataProvider, query, 1], // First page only for now
    queryFn: () => {
      if (dataProvider === PROVIDER_DISCOGS) {
        return DiscogsSearch(query);
      } else if (dataProvider === PROVIDER_LASTFM) {
        return LastFmSearch(query);
      }
    },
    enabled: !!query,
  });

  if (isFetching) {
    return <Spinner />;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="col-12 text-center my-4">
        <Trans i18nKey="noArtistsFound" values={{ albumOrArtist: query }}>
          No artists found for <em>your search query</em>
        </Trans>
      </div>
    );
  } else {
    const navigateToArtist = (e) => {
      e.preventDefault();
      const { artistId } = e.currentTarget.dataset;
      const selectedArtist = data[artistId];

      ReactGA.event({
        category: 'Interactions',
        action: 'Search artist',
      });

      const navigateWithState = (url) => navigate(url, { state: { query } });

      if ((selectedArtist as LastFmArtist).mbid) {
        navigateWithState(`/scrobble/artist/mbid/${encodeURIComponent((selectedArtist as LastFmArtist).mbid)}`);
      } else if ((selectedArtist as DiscogsArtist).discogsId) {
        navigateWithState(`/scrobble/artist/dsid/${encodeURIComponent((selectedArtist as DiscogsArtist).discogsId)}`);
      } else {
        navigateWithState(`/scrobble/artist/${encodeURIComponent(selectedArtist.name)}`);
      }
    };

    return <ArtistList artists={data} onClick={navigateToArtist} />;
  }
}
