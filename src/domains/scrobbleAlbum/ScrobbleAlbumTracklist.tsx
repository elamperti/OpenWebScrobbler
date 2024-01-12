import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactGA from 'react-ga-neo';
import { Trans } from 'react-i18next';

import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { _discogsFindBestMatch } from 'store/actions/albumActions';
import ScrobbleList from 'components/ScrobbleList';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import Spinner from 'components/Spinner';
import Tracklist from './partials/Tracklist';
import AlbumBreadcrumb from './partials/AlbumBreadcrumb';

import { MAX_RECENT_ALBUMS, PROVIDER_DISCOGS, PROVIDER_LASTFM } from 'Constants';

import { albumGetInfo as DiscogsAlbumGetInfo } from 'utils/clients/discogs';
import { albumGetInfo as LastfmAlbumGetInfo } from 'utils/clients/lastfm';
import useLocalStorage from 'hooks/useLocalStorage';

import type { RootState } from 'store';
import type { DiscogsAlbum, Album } from 'utils/types/album';

const sanitizeParam = (param: string) => {
  return param ? decodeURIComponent(param) : null;
};

export function ScrobbleAlbumTracklist() {
  const navigate = useNavigate();

  const params = useParams();
  const { state } = useLocation();
  // const [tracklistDataProvider, setTracklistDataProvider] = useState(null);
  const [triedAlternativeProvider, setTriedAlternativeProvider] = useState(false);
  const scrobbles = useSelector((state: RootState) => state.scrobbles.list);
  const [recentAlbums, setRecentAlbums] = useLocalStorage<Album[]>('recentAlbums', []);

  const albumId = sanitizeParam(params.albumId);
  const discogsId = sanitizeParam(params.discogsId);
  const albumName = sanitizeParam(params.albumName);
  const artist = sanitizeParam(params.artist);

  let queryKeyDetails = [];
  let tracklistDataProvider = null;

  if (!triedAlternativeProvider) {
    if (albumId || discogsId) {
      setTriedAlternativeProvider(true);
    }
  }

  if (albumId) {
    tracklistDataProvider = PROVIDER_LASTFM;
    queryKeyDetails = ['mbid', albumId];
  } else if (discogsId) {
    tracklistDataProvider = PROVIDER_DISCOGS;
    queryKeyDetails = ['discogsId', discogsId];
  } else if (artist && albumName) {
    tracklistDataProvider = PROVIDER_LASTFM;
    queryKeyDetails = ['raw', artist, albumName];
  }

  const albumInfo = useQuery({
    queryKey: ['album', tracklistDataProvider, ...queryKeyDetails],
    queryFn: () => {
      if (tracklistDataProvider === PROVIDER_DISCOGS) {
        return DiscogsAlbumGetInfo(discogsId);
      } else {
        // uses mbid if defined, otherwise artist+album
        return LastfmAlbumGetInfo({
          mbid: albumId,
          artist,
          name: albumName,
        });
      }
    },
    enabled: queryKeyDetails.length > 0,
  });

  // This effect tries a Discogs search for a close match when lastfm fails
  // FIXME: removing this block would simplify the component significantly
  useEffect(() => {
    if (Array.isArray(albumInfo.data?.tracks) && albumInfo.data.tracks.length === 0) {
      if (params?.albumName && tracklistDataProvider !== PROVIDER_DISCOGS) {
        _discogsFindBestMatch({
          artist,
          name: albumName,
        })
          .then((topMatchId) => {
            if (topMatchId) {
              ReactGA.event({
                category: 'Albums',
                action: 'Navigate to top match',
              });
              navigate(`/scrobble/album/view/dsid/${topMatchId}`, { state });
            } else {
              setTriedAlternativeProvider(true);
            }
          })
          .catch(() => setTriedAlternativeProvider(true));

        ReactGA.event({
          category: 'Albums',
          action: 'Find top match',
        });
      }
    } else {
      if (tracklistDataProvider !== PROVIDER_DISCOGS) {
        setTriedAlternativeProvider(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumInfo.data, albumInfo.isFetching]);

  useEffect(() => {
    if (albumInfo.isSuccess && albumInfo.data?.info) {
      const newAlbum = albumInfo.data?.info;
      const currentIndex = recentAlbums.findIndex(
        ({ name, artist }) => name === newAlbum.name && artist === newAlbum.artist
      );

      if (currentIndex > -1) {
        recentAlbums.splice(currentIndex, 1);
      }
      recentAlbums.unshift(newAlbum);
      setRecentAlbums(recentAlbums.slice(0, MAX_RECENT_ALBUMS));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumInfo.isSuccess]);

  return (
    <>
      <AlbumBreadcrumb
        artistQuery={state?.artist}
        artistDiscogsId={(albumInfo.data?.info as DiscogsAlbum)?.artistId}
        albumQuery={state?.query}
        album={albumInfo.data?.info || state?.album}
        dataProvider={tracklistDataProvider}
      />
      <div className="row mb-5">
        <div className="col-md-7 mb-4">
          {!albumInfo.isLoading || (Array.isArray(albumInfo.data?.tracks) && triedAlternativeProvider) ? (
            <Tracklist tracks={albumInfo.data?.tracks || []} albumInfo={albumInfo.data?.info} />
          ) : (
            <Spinner />
          )}
        </div>
        <div className="col-md-5">
          <h4>
            <FontAwesomeIcon icon={faHistory} /> <Trans i18nKey="yourHistory" />
          </h4>
          <div className="ScrobbleList-container">
            <ScrobbleList scrobbles={scrobbles}>
              <EmptyScrobbleListFiller />
            </ScrobbleList>
          </div>
        </div>
      </div>
    </>
  );
}
