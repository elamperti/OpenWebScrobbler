import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { clearAlbumsSearch, setAlbumQuery } from 'store/actions/albumActions';

import { Row } from 'reactstrap';

import AlbumBreadcrumb from './partials/AlbumBreadcrumb';
import AlbumResults from './partials/AlbumResults';
import ArtistResults from './partials/ArtistResults';

export function ScrobbleAlbumResults({ match }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const searchQuery = useSelector((state) => state.album.queries);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Clears any previous search queries/results
    dispatch(clearAlbumsSearch());
  }, [dispatch]);

  useEffect(() => {
    // This extracts the search parameter from the URL
    const { albumName } = match.params;

    setQuery(decodeURIComponent(albumName || ''));
  }, [match]);

  useEffect(() => {
    if (query) {
      dispatch(setAlbumQuery(query));
    }
  }, [query, dispatch]);

  return (
    <React.Fragment>
      <h2 className="m-0 d-inline">
        <FontAwesomeIcon icon={faCompactDisc} className="mr-2" />
        {t('scrobbleAlbum')}
      </h2>
      <AlbumBreadcrumb artistQuery={searchQuery.artist} albumQuery={searchQuery.album} />
      <Row className="mb-4">
        <div className="col-md-8">
          <h3 className="mt-3 mb-0">{t('album', { count: 2 })}</h3>
          <AlbumResults query={query} useFullWidth={false} />
        </div>
        <div className="col-md-4">
          <h3 className="mt-3 mb-0">{t('artist', { count: 2 })}</h3>
          <ArtistResults query={query} />
        </div>
      </Row>
    </React.Fragment>
  );
}

ScrobbleAlbumResults.propTypes = {
  match: PropTypes.object,
};
