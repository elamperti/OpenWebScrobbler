import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReactGA from 'react-ga';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { searchAlbums, searchTopAlbums } from 'store/actions/albumActions';

import Spinner from 'components/Spinner';
import AlbumList from './AlbumList';

export default function AlbumResults({
  useFullWidth,
  query,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const albums = useSelector(state => state.album.list);

  const colSizes = useFullWidth ? 'col-6 col-md-4 col-xl-3' : 'col-6 col-xl-4';

  useEffect(() => {
    if (query && !albums) {
      // A not-so-nice way to tell a simple query from an artist query
      dispatch(query.name ? searchTopAlbums(query) : searchAlbums(query));
    }
  }, [query, albums, dispatch]);

  if (Array.isArray(albums)) {
    if (albums.length === 0) {
      // TODO: Make this a partial
      return (
        <div className="col-12 text-center my-4">
          <Trans t={t} i18nKey="noAlbumsFound" values={{ albumOrArtist: query }}>
            No albums found for <em>your search query</em>
          </Trans>
          <br />
          <a href={`/scrobble/album?q=${encodeURIComponent(query)}`} className="my-2">
            <FontAwesomeIcon icon={faArrowLeft} />{` ${t('goBack')}`}
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
          history.push(`/scrobble/album/view/mbid/${targetAlbum.mbid}`);
        } else {
          history.push(`/scrobble/album/view/${encodeURIComponent(targetAlbum.artist)}/${encodeURIComponent(targetAlbum.name)}`);
        }
      };

      return <AlbumList albums={albums} className={colSizes} onClick={navigateToAlbum} />;
    }
  } else {
    return <Spinner />;
  }
}

// ToDo: ADD PROPTYPES
