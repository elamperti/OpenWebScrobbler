import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc, faUser } from '@fortawesome/free-solid-svg-icons';

import ProviderItem from './ProviderItem';
import { albumViewPath } from '../albumViewPath';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { Album, BandcampAlbum } from 'utils/types/album';

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
  showProviderDropdown?: boolean;
}

export default function AlbumBreadcrumb({
  albumQuery,
  artistQuery,
  artistDiscogsId,
  album,
  dataProvider,
  showProviderDropdown,
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
  const bandcampId = (album as BandcampAlbum)?.bandcampId;
  if (artistQuery || albumArtist) {
    if (bandcampId) {
      itemList.push(
        generateBreadcrumbItem(
          `/scrobble/artist/bc/${new URL(bandcampId).hostname}`,
          albumArtist || artistQuery,
          { artist: albumArtist, query: albumQuery, provider: dataProvider },
          faUser
        )
      );
    } else if (artistDiscogsId) {
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
    itemList.push(generateBreadcrumbItem(albumViewPath(album), album.name, { query: albumQuery }, faCompactDisc));
  }

  return (
    <Breadcrumb className="my-3">
      {itemList}
      {dataProvider && (
        <div className="flex-grow-1 text-end">
          <ProviderItem dataProvider={dataProvider} showDropdown={showProviderDropdown} />
        </div>
      )}
    </Breadcrumb>
  );
}
