import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReactGA from 'react-ga';

import { searchArtists } from 'store/actions/artistActions';

import Spinner from 'components/Spinner';
import ArtistList from './ArtistList';

export default function ArtistResults({ query }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const artists = useSelector(state => state.artist.list);

  useEffect(() => {
    if (query && !artists) {
      dispatch(searchArtists(query));
    }
  }, [query, artists, dispatch]);

  if (Array.isArray(artists)) {
    if (artists.length === 0) {
      return (
        <div className="col-12 text-center my-4">
          <Trans t={t} i18nKey="noArtistsFound" values={{ albumOrArtist: query }}>
            No artists found for <em>your search query</em>
          </Trans>
        </div>
      );
    } else {
      const navigateToArtist = (e) => {
        e.preventDefault();
        const { artistId } = e.currentTarget.dataset;

        ReactGA.event({
          category: 'Interactions',
          action: 'Search artist',
        });

        history.push(`/scrobble/artist/${encodeURIComponent(artists[artistId].name)}`);
      };

      return <ArtistList artists={artists} onClick={navigateToArtist} />;
    }
  } else {
    return <Spinner />;
  }
}

ArtistResults.propTypes = {
  query: PropTypes.string,
};
