import { useEffect } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReactGA from 'react-ga';

import { searchArtists } from 'store/actions/artistActions';

import Spinner from 'components/Spinner';
import ArtistList from './ArtistList';

import type { RootState } from 'store';

export default function ArtistResults({ query }: { query: string }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const artists = useSelector((state: RootState) => state.artist.list);
  const dataProvider = useSelector((state: RootState) => state.settings.dataProvider);

  useEffect(() => {
    if (query && !artists) {
      const opts = { provider: dataProvider };

      dispatch(searchArtists(query, opts));
    }
  }, [query, artists, dataProvider, dispatch]);

  if (Array.isArray(artists)) {
    if (artists.length === 0) {
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
        const selectedArtist = artists[artistId];

        ReactGA.event({
          category: 'Interactions',
          action: 'Search artist',
        });

        if (selectedArtist.mbid) {
          navigate(`/scrobble/artist/mbid/${encodeURIComponent(selectedArtist.mbid)}`);
        } else if (selectedArtist.discogsId) {
          navigate(`/scrobble/artist/dsid/${encodeURIComponent(selectedArtist.discogsId)}`);
        } else {
          navigate(`/scrobble/artist/${encodeURIComponent(selectedArtist.name)}`);
        }
      };

      return <ArtistList artists={artists} onClick={navigateToArtist} />;
    }
  } else {
    return <Spinner />;
  }
}
