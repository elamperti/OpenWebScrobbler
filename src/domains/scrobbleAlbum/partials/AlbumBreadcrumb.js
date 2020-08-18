import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import {
  faCompactDisc,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function generateBreadcrumbItem(targetPath, caption, icon) {
  return (
    <BreadcrumbItem tag={Link} to={targetPath} key={targetPath}>
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {caption}
    </BreadcrumbItem>
  );
}

export default function AlbumBreadcrumb({
  albumQuery,
  artistQuery,
  album,
}) {
  const { t } = useTranslation();
  const itemList = [
    generateBreadcrumbItem('/scrobble/album', t('search')),
  ];

  if (albumQuery) {
    itemList.push(generateBreadcrumbItem(`/scrobble/album/search/${encodeURIComponent(albumQuery)}`, `"${albumQuery}"`));
  }

  const albumArtist = album.artist;
  if (artistQuery || albumArtist) {
    itemList.push(generateBreadcrumbItem(`/scrobble/artist/${encodeURIComponent(albumArtist || artistQuery)}`, albumArtist || `"${artistQuery}"`, albumArtist ? faUser : undefined));
  }

  if (album.name) {
    let targetPath;
    if (album.mbid) {
      targetPath = `/scrobble/album/view/mbid/${album.mbid}`;
    } else if (album.discogsId) {
      targetPath = `/scrobble/album/view/dsid/${album.discogsId}`;
    } else {
      targetPath = `/scrobble/album/view/${encodeURIComponent(album.artist)}/${encodeURIComponent(album.name)}`;
    }

    itemList.push(generateBreadcrumbItem(targetPath, album.name, faCompactDisc));
  }

  return (
    <Breadcrumb className="my-3">
      {itemList}
    </Breadcrumb>
  );
}

AlbumBreadcrumb.propTypes = {
  albumQuery: PropTypes.string,
  artistQuery: PropTypes.string,
  album: PropTypes.object,
};

AlbumBreadcrumb.defaultProps = {
  album: {},
};
