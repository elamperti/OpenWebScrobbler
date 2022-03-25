import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { clearAlbumTracklist, getAlbum, _discogsFindBestMatch } from 'store/actions/albumActions';
import ScrobbleList from 'components/ScrobbleList';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import Spinner from 'components/Spinner';
import Tracklist from './partials/Tracklist';
import AlbumBreadcrumb from './partials/AlbumBreadcrumb';
import { PROVIDER_DISCOGS, PROVIDER_LASTFM } from 'Constants';

export function ScrobbleAlbumTracklist() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [tracklistDataProvider, setTracklistDataProvider] = useState(null);
  const [triedAlternativeProvider, setTriedAlternativeProvider] = useState(false);

  const albumInfo = useSelector((state) => state.album.info);
  const searchQuery = useSelector((state) => state.album.queries);
  const tracks = useSelector((state) => state.album.tracks);
  const scrobbles = useSelector((state) => state.scrobbles.list);

  useEffect(() => {
    // Clears any previous tracklist (this should be improved)
    dispatch(clearAlbumTracklist());
  }, [dispatch]);

  useEffect(() => {
    const { albumId, discogsId, albumName, artist } = params;
    if (albumId) {
      setTracklistDataProvider(PROVIDER_LASTFM);
      setTriedAlternativeProvider(true);
      dispatch(
        getAlbum({
          mbid: decodeURIComponent(albumId),
        })
      );
    } else if (discogsId) {
      setTracklistDataProvider(PROVIDER_DISCOGS);
      setTriedAlternativeProvider(true);
      dispatch(
        getAlbum({
          discogsId: decodeURIComponent(discogsId),
        })
      );
    } else if (artist && albumName) {
      setTracklistDataProvider(PROVIDER_LASTFM);
      dispatch(
        getAlbum({
          artist: decodeURIComponent(artist),
          name: decodeURIComponent(albumName),
        })
      );
    }
  }, [dispatch, params]);

  // ToDo: refactor this block
  useEffect(() => {
    if (Array.isArray(tracks)) {
      if (tracks.length === 0) {
        if (params.albumName && tracklistDataProvider !== PROVIDER_DISCOGS) {
          // eslint-disable-next-line space-before-function-paren
          (async () => {
            const { albumName, artist } = params;
            const topMatchId = await _discogsFindBestMatch({
              artist: decodeURIComponent(artist),
              name: decodeURIComponent(albumName),
            });

            if (topMatchId) {
              dispatch(clearAlbumTracklist());
              navigate(`/scrobble/album/view/dsid/${topMatchId}`);
            } else {
              setTriedAlternativeProvider(true);
            }
          })();
        }
      } else {
        if (tracklistDataProvider !== PROVIDER_DISCOGS) {
          setTriedAlternativeProvider(true);
        }
      }
    }
  }, [tracks, navigate, params, tracklistDataProvider, dispatch]);

  return (
    <React.Fragment>
      <AlbumBreadcrumb
        artistQuery={searchQuery.artist}
        albumQuery={searchQuery.album}
        album={albumInfo}
        dataProvider={tracklistDataProvider}
      />
      <div className="row mb-5">
        <div className="col-md-7 mb-4">
          {Array.isArray(tracks) && triedAlternativeProvider ? (
            <Tracklist tracks={tracks} albumInfo={albumInfo} />
          ) : (
            <Spinner />
          )}
        </div>
        <div className="col-md-5">
          <h4>
            <FontAwesomeIcon icon={faHistory} />
            {` ${t('yourHistory')}`}
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
