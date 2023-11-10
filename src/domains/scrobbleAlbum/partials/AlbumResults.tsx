import React, { useEffect } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReactGA from 'react-ga';
import get from 'lodash/get';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { searchAlbums, searchTopAlbums } from 'store/actions/albumActions';

import Spinner from 'components/Spinner';
import AlbumList from './AlbumList';

import type { RootState } from 'store';

export default function AlbumResults({
  useFullWidth,
  query,
  topAlbums = false,
}: {
  useFullWidth: boolean;
  query: string;
  topAlbums?: boolean;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const albums = useSelector((state: RootState) => state.album.list);
  const dataProvider = useSelector((state: RootState) => state.settings.dataProvider);
  const colSizes = useFullWidth ? 'col-6 col-md-4 col-xl-3' : 'col-6 col-xl-4';

  useEffect(() => {
    if (query && !albums) {
      const opts = { provider: dataProvider, includeReleases: state?.includeReleases };
      dispatch(topAlbums ? searchTopAlbums(query) : searchAlbums(query, opts));
    }
  }, [topAlbums, query, albums, dataProvider, state, dispatch]);

  if (Array.isArray(albums)) {
    if (albums.length === 0) {
      return (
        <div className="col-12 text-center my-4">
          <Trans i18nKey="noAlbumsFound" values={{ albumOrArtist: get(query, 'name', query) }}>
            No albums found for <em>your search query</em>
          </Trans>
          <br />
          <a href={`/scrobble/album?q=${encodeURIComponent(query)}`} className="my-2">
            <FontAwesomeIcon icon={faArrowLeft} /> <Trans i18nKey="goBack">Go back</Trans>
          </a>
        </div>
      );
    } else {
      const navigateToAlbum = (e) => {
        e.preventDefault();
        const { albumIndex } = e.currentTarget.dataset;
        const targetAlbum = albums[albumIndex];

        ReactGA.event({
          category: 'Interactions',
          action: 'Click album',
          label: albumIndex,
        });

        if (targetAlbum.mbid) {
          navigate(`/scrobble/album/view/mbid/${targetAlbum.mbid}`);
        } else if (targetAlbum.discogsId) {
          navigate(`/scrobble/album/view/dsid/${targetAlbum.discogsId}`);
        } else {
          navigate(
            `/scrobble/album/view/${encodeURIComponent(targetAlbum.artist.replace('%', ''))}` +
              `/${encodeURIComponent(targetAlbum.name.replace('%', ''))}`
          );
        }
      };

      return <AlbumList albums={albums} className={colSizes} onClick={navigateToAlbum} />;
    }
  } else {
    return <Spinner />;
  }
}
