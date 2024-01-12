import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import { faCompactDisc, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PROVIDER_NAME } from 'Constants';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { Album, DiscogsAlbum, LastFmAlbum } from 'utils/types/album';

import './AlbumBreadcrumb.scss';

function generateBreadcrumbItem(targetPath: string, caption: string, state = {}, icon: IconProp = undefined) {
  return (
    <BreadcrumbItem className="ows-AlbumBreadcrumb-item" key={targetPath}>
      <Link to={targetPath} state={state}>
        {icon && <FontAwesomeIcon icon={icon} className="me-2 mt-1" />}
        {caption}
      </Link>
    </BreadcrumbItem>
  );
}

interface AlbumBreadcrumbProps {
  album?: Album;
  albumQuery?: string;
  artistQuery?: string;
  artistDiscogsId?: string;
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
  const itemList = [generateBreadcrumbItem('/scrobble/album', t('search'), { provider: dataProvider })];

  if (albumQuery) {
    itemList.push(
      generateBreadcrumbItem(
        `/scrobble/album/search/${encodeURIComponent(albumQuery.replace(/%(?![0-9A-F])/g, 'PERCENT_SIGN'))}`,
        `"${albumQuery}"`, // This is quoting the query
        { provider: dataProvider }
      )
    );
  }

  const albumArtist = album?.artist;
  if (artistQuery || albumArtist) {
    if (artistDiscogsId) {
      itemList.push(
        generateBreadcrumbItem(
          `/scrobble/artist/dsid/${artistDiscogsId}`,
          albumArtist || artistQuery,
          { artist: albumArtist, query: albumQuery },
          faUser
        )
      );
    } else {
      itemList.push(
        generateBreadcrumbItem(
          `/scrobble/artist/${encodeURIComponent(albumArtist || artistQuery).replace(
            /%(?![0-9A-F])/g,
            'PERCENT_SIGN'
          )}`,
          albumArtist || `"${artistQuery}"`, // This is quoting the query
          { query: albumQuery, provider: dataProvider },
          albumArtist ? faUser : undefined
        )
      );
    }
  }

  if (album && album.name) {
    let targetPath;

    if ((album as LastFmAlbum).mbid) {
      targetPath = `/scrobble/album/view/mbid/${(album as LastFmAlbum).mbid}`;
    } else if ((album as DiscogsAlbum).discogsId) {
      targetPath = `/scrobble/album/view/dsid/${(album as DiscogsAlbum).discogsId}`;
    } else {
      targetPath =
        `/scrobble/album/view/${encodeURIComponent(album.artist.replace('%', ''))}` +
        `/${encodeURIComponent(album.name.replace('%', ''))}`;
    }

    itemList.push(generateBreadcrumbItem(targetPath, album.name, { query: albumQuery }, faCompactDisc));
  }

  return (
    <Breadcrumb className="my-3">
      {itemList}
      {dataProvider && (
        <div className="flex-grow-1 text-end">
          {t('dataProvider')}: <span data-cy="AlbumBreadcrumb-provider">{PROVIDER_NAME[dataProvider]}</span>
        </div>
      )}
    </Breadcrumb>
  );
}
