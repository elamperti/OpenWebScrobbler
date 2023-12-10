import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { clearAlbumsSearch, setAlbumQuery } from 'store/actions/albumActions';

import { Row } from 'reactstrap';

import AlbumBreadcrumb from './partials/AlbumBreadcrumb';
import AlbumResults from './partials/AlbumResults';
import ArtistResults from './partials/ArtistResults';

import type { RootState } from 'store';

export function ScrobbleAlbumResults() {
  const dispatch = useDispatch();
  const params = useParams();

  const searchQuery = useSelector((state: RootState) => state.album.queries);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Clears any previous search queries/results
    dispatch(clearAlbumsSearch());
  }, [dispatch]);

  useEffect(() => {
    // This extracts the search parameter from the URL
    const { albumName } = params;

    setQuery(decodeURIComponent(albumName || '').replace('PERCENT_SIGN', '%'));
  }, [params]);

  useEffect(() => {
    if (query) {
      dispatch(setAlbumQuery(query));
    }
  }, [query, dispatch]);

  return (
    <>
      <h2 className="m-0 d-inline">
        <FontAwesomeIcon icon={faCompactDisc} className="me-2" />
        <Trans i18nKey="scrobbleAlbum">Scrobble Album</Trans>
      </h2>
      <AlbumBreadcrumb artistQuery={searchQuery.artist} albumQuery={searchQuery.album} />
      <Row className="mb-4">
        <div className="col-md-8">
          <AlbumResults query={query} useFullWidth={false} />
        </div>
        <div className="col-md-4">
          <h3 className="mt-3 mb-0">
            <Trans i18nKey="artist" count={3}>
              Artist
            </Trans>
          </h3>
          <ArtistResults query={query} />
        </div>
      </Row>
    </>
  );
}
