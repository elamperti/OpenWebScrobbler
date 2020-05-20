import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  faHistory,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { clearAlbumTracklist, getAlbum } from 'store/actions/albumActions';
import ScrobbleList from 'components/ScrobbleList';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import Spinner from 'components/Spinner';
import Tracklist from './partials/Tracklist';
import AlbumBreadcrumb from './partials/AlbumBreadcrumb';

export function ScrobbleAlbumTracklist({ match }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const albumInfo = useSelector(state => state.album.info);
  const searchQuery = useSelector(state => state.album.queries);
  const tracks = useSelector(state => state.album.tracks);
  const scrobbles = useSelector(state => state.scrobbles.list);

  useEffect(() => {
    // Clears any previous tracklist (this should be improved)
    dispatch(clearAlbumTracklist());
  }, [dispatch]);

  useEffect(() => {
    const { albumId, albumName, artist } = match.params;

    if (albumId) {
      dispatch(getAlbum({
        mbid: decodeURIComponent(albumId),
      }));
    } else if (artist && albumName) {
      dispatch(getAlbum({
        artist: decodeURIComponent(artist),
        name: decodeURIComponent(albumName),
      }));
    }
  }, [dispatch, match]);

  return (
    <React.Fragment>
      <AlbumBreadcrumb artistQuery={searchQuery.artist} albumQuery={searchQuery.album} album={albumInfo} />
      <div className="row mb-5">
        <div className="col-md-7 mb-4">
          { Array.isArray(tracks) ? <Tracklist tracks={tracks} albumInfo={albumInfo} /> : <Spinner /> }
        </div>
        <div className="col-md-5">
          <h4>
            <FontAwesomeIcon icon={faHistory} />{` ${t('yourHistory')}`}
          </h4>
          <div className="ScrobbleList-container">
            <ScrobbleList scrobbles={scrobbles}>
              <EmptyScrobbleListFiller />
            </ScrobbleList>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

ScrobbleAlbumTracklist.propTypes = {
  match: PropTypes.object,
};
