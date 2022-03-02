import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import { faCompactDisc, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './AlbumBreadcrumb.scss';

function generateBreadcrumbItem(targetPath, caption, icon) {
  return (
    <BreadcrumbItem className="ows-AlbumBreadcrumb-item" key={targetPath}>
      <Link to={targetPath}>
        {icon && <FontAwesomeIcon icon={icon} className="me-2 mt-1" />}
        {caption}
      </Link>
    </BreadcrumbItem>
  );
}

export default function AlbumBreadcrumb({ albumQuery, artistQuery, artistDiscogsId, album, dataProvider }) {
  const { t } = useTranslation();
  const itemList = [generateBreadcrumbItem('/scrobble/album', t('search'))];

  if (albumQuery) {
    itemList.push(
      generateBreadcrumbItem(
        `/scrobble/album/search/${encodeURIComponent(albumQuery.replace(/%(?![0-9A-F])/g, 'PERCENT_SIGN'))}`,
        `"${albumQuery}"`
      )
    );
  }

  const albumArtist = album.artist;
  if (artistQuery || albumArtist) {
    if (artistDiscogsId) {
      itemList.push(
        generateBreadcrumbItem(`/scrobble/artist/dsid/${artistDiscogsId}`, albumArtist || artistQuery, faUser)
      );
    } else {
      itemList.push(
        generateBreadcrumbItem(
          `/scrobble/artist/${encodeURIComponent(albumArtist || artistQuery).replace(
            /%(?![0-9A-F])/g,
            'PERCENT_SIGN'
          )}`,
          albumArtist || `"${artistQuery}"`,
          albumArtist ? faUser : undefined
        )
      );
    }
  }

  if (album.name) {
    let targetPath;
    if (album.mbid) {
      targetPath = `/scrobble/album/view/mbid/${album.mbid}`;
    } else if (album.discogsId) {
      targetPath = `/scrobble/album/view/dsid/${album.discogsId}`;
    } else {
      targetPath =
        `/scrobble/album/view/${encodeURIComponent(album.artist.replace('%', ''))}` +
        `/${encodeURIComponent(album.name.replace('%', ''))}`;
    }

    itemList.push(generateBreadcrumbItem(targetPath, album.name, faCompactDisc));
  }

  return (
    <Breadcrumb className="my-3">
      {itemList}
      {dataProvider && (
        <div className="flex-grow-1 text-end">
          {t('dataProvider')}: {dataProvider}
        </div>
      )}
    </Breadcrumb>
  );
}

AlbumBreadcrumb.propTypes = {
  albumQuery: PropTypes.string,
  artistQuery: PropTypes.string,
  artistDiscogsId: PropTypes.number,
  album: PropTypes.object,
  dataProvider: PropTypes.string,
};

AlbumBreadcrumb.defaultProps = {
  album: {},
};
