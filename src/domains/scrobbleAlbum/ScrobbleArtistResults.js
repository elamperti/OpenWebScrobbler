import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { clearAlbumsArtistSearch, setArtistQuery } from 'store/actions/albumActions';

import AlbumBreadcrumb from './partials/AlbumBreadcrumb';
import AlbumResults from './partials/AlbumResults';

export function ScrobbleArtistResults({ match }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const searchQuery = useSelector(state => state.album.queries);
  const [artist, setArtist] = useState(null);

  // ToDo: refactor all these useEffects; avoid having an internal state
  useEffect(() => {
    // Clears any previous search queries/results
    dispatch(clearAlbumsArtistSearch());
  }, [dispatch]);

  useEffect(() => {
    // This extracts the search parameter from the URL
    const { artistName, mbid, discogsId } = match.params;

    setArtist({
      name: decodeURIComponent(artistName || ''),
      mbid,
      discogsId,
    });
  }, [match]);

  useEffect(() => {
    if (artist && artist.name) {
      dispatch(setArtistQuery(artist.name));
    }
  }, [artist, dispatch]);

  return (
    <React.Fragment>
      <h2 className="m-0 d-inline">
        <FontAwesomeIcon icon={faCompactDisc} className="mr-2" />{t('scrobbleAlbum')}
      </h2>
      <AlbumBreadcrumb artistQuery={searchQuery.artist} albumQuery={searchQuery.album} />
      <h3 className="mt-3 mb-0">
        {searchQuery.artist && <Trans i18nKey="topAlbumsBy" t={t} values={{ nameOfArtist: searchQuery.artist }} />}
      </h3>
      <AlbumResults query={artist} useFullWidth={true} topAlbums={true} />
    </React.Fragment>
  );
}

ScrobbleArtistResults.propTypes = {
  match: PropTypes.object,
};
