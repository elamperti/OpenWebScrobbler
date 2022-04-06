import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReactGA from 'react-ga';
import get from 'lodash/get';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { searchAlbums, searchTopAlbums } from 'store/actions/albumActions';

import Spinner from 'components/Spinner';
import AlbumList from './AlbumList';

export default function AlbumResults({ useFullWidth, query, topAlbums }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { state } = useLocation();

  const albums = useSelector((state) => state.album.list);
  const dataProvider = useSelector((state) => state.settings.dataProvider);
  const colSizes = useFullWidth ? 'col-6 col-md-4 col-xl-3' : 'col-6 col-xl-4';

  useEffect(() => {
    if (query && !albums) {
      const opts = { provider: dataProvider, includeReleases: state?.includeReleases };
      dispatch(topAlbums ? searchTopAlbums(query, opts) : searchAlbums(query, opts));
    }
  }, [topAlbums, query, albums, dataProvider, dispatch]);

  if (Array.isArray(albums)) {
    if (albums.length === 0) {
      return (
        <div className="col-12 text-center my-4">
          <Trans t={t} i18nKey="noAlbumsFound" values={{ albumOrArtist: get(query, 'name', query) }}>
            No albums found for <em>your search query</em>
          </Trans>
          <br />
          <a href={`/scrobble/album?q=${encodeURIComponent(query)}`} className="my-2">
            <FontAwesomeIcon icon={faArrowLeft} />
            {` ${t('goBack')}`}
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

AlbumResults.propTypes = {
  useFullWidth: PropTypes.bool,
  topAlbums: PropTypes.bool,
  query: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

AlbumResults.defaultProps = {
  topAlbums: false,
};
