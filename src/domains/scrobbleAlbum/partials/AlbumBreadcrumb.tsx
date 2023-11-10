import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import { faCompactDisc, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

import './AlbumBreadcrumb.scss';

/**
 * Generates a breadcrumb item
 *
 * @param targetPath Relative path to link
 * @param caption Text shown in breadcrumb
 * @param [icon] FontAwesome icon
 * @returns BreadcrumbItem
 */
function generateBreadcrumbItem(targetPath: string, caption: string, icon: IconProp = undefined) {
  return (
    <BreadcrumbItem className="ows-AlbumBreadcrumb-item" key={targetPath}>
      <Link to={targetPath}>
        {icon && <FontAwesomeIcon icon={icon} className="me-2 mt-1" />}
        {caption}
      </Link>
    </BreadcrumbItem>
  );
}

interface AlbumBreadcrumbProps {
  album?: {
    artist: string;
    discogsId?: number;
    mbid?: string;
    name: string;
  };
  albumQuery?: string;
  artistQuery?: string;
  artistDiscogsId?: number;
  dataProvider?: string;
}

export default function AlbumBreadcrumb({
  albumQuery,
  artistQuery,
  artistDiscogsId,
  album,
  dataProvider,
}: AlbumBreadcrumbProps) {
  const { t } = useTranslation();
  const itemList = [generateBreadcrumbItem('/scrobble/album', t('search'))];

  if (albumQuery) {
    itemList.push(
      generateBreadcrumbItem(
        `/scrobble/album/search/${encodeURIComponent(albumQuery.replace(/%(?![0-9A-F])/g, 'PERCENT_SIGN'))}`,
        `"${albumQuery}"` // This is quoting the query
      )
    );
  }

  const albumArtist = album?.artist;
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
          albumArtist || `"${artistQuery}"`, // This is quoting the query
          albumArtist ? faUser : undefined
        )
      );
    }
  }

  if (album?.name) {
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
