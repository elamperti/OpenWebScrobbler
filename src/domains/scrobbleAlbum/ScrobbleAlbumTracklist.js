import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  faHistory,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { clearAlbumTracklist, getAlbum, _discogsFindBestMatch } from 'store/actions/albumActions';
import ScrobbleList from 'components/ScrobbleList';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import Spinner from 'components/Spinner';
import Tracklist from './partials/Tracklist';
import AlbumBreadcrumb from './partials/AlbumBreadcrumb';
import { PROVIDER_DISCOGS, PROVIDER_LASTFM } from 'Constants';

export function ScrobbleAlbumTracklist({ match }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const [tracklistDataProvider, setTracklistDataProvider] = useState(null);
  const [triedAlternativeProvider, setTriedAlternativeProvider] = useState(false);

  const albumInfo = useSelector(state => state.album.info);
  const searchQuery = useSelector(state => state.album.queries);
  const tracks = useSelector(state => state.album.tracks);
  const scrobbles = useSelector(state => state.scrobbles.list);

  useEffect(() => {
    // Clears any previous tracklist (this should be improved)
    dispatch(clearAlbumTracklist());
  }, [dispatch]);

  useEffect(() => {
    const { albumId, discogsId, albumName, artist } = match.params;

    if (albumId) {
      setTracklistDataProvider(PROVIDER_LASTFM);
      setTriedAlternativeProvider(true);
      dispatch(getAlbum({
        mbid: decodeURIComponent(albumId),
      }));
    } else if (discogsId) {
      setTracklistDataProvider(PROVIDER_DISCOGS);
      setTriedAlternativeProvider(true);
      dispatch(getAlbum({
        discogsId: decodeURIComponent(discogsId),
      }));
    } else if (artist && albumName) {
      setTracklistDataProvider(PROVIDER_LASTFM);
      dispatch(getAlbum({
        artist: decodeURIComponent(artist),
        name: decodeURIComponent(albumName),
      }));
    }
  }, [dispatch, match]);

  useEffect(() => {
    if (Array.isArray(tracks) && tracks.length === 0) {
      if (match.params.albumName && tracklistDataProvider !== PROVIDER_DISCOGS) {
        // ToDo: refactor this block of code
        (async() => {
          const { albumName, artist } = match.params;
          const topMatchId = await _discogsFindBestMatch({
            artist: decodeURIComponent(artist),
            name: decodeURIComponent(albumName),
          });

          if (topMatchId) {
            history.push(`/scrobble/album/view/dsid/${topMatchId}`);
          } else {
            setTriedAlternativeProvider(true);
          }
        })();
      } else {
        setTriedAlternativeProvider(true);
      }
    }
  }, [tracks, history, match, tracklistDataProvider]);

  return (
    <React.Fragment>
      <AlbumBreadcrumb artistQuery={searchQuery.artist} albumQuery={searchQuery.album} album={albumInfo} dataProvider={tracklistDataProvider} />
      <div className="row mb-5">
        <div className="col-md-7 mb-4">
          { Array.isArray(tracks) && triedAlternativeProvider ? <Tracklist tracks={tracks} albumInfo={albumInfo} /> : <Spinner /> }
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
