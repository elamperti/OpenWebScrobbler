import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga-neo';
import { get } from 'lodash-es';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Spinner from 'components/Spinner';
import AlbumList from './AlbumList';

import type { Album, DiscogsAlbum, LastFmAlbum } from 'utils/types/album';

export default function AlbumResults({
  useFullWidth,
  query,
  albums = [],
}: {
  useFullWidth: boolean;
  query: string;
  albums: Album[];
}) {
  const navigate = useNavigate();
  const colSizes = useFullWidth ? 'col-6 col-md-4 col-xl-3' : 'col-6 col-xl-4';

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

        const navigateWithState = (url: string) =>
          navigate(url, {
            state: {
              artist: targetAlbum.artist,
              album: targetAlbum.name,
              query,
            },
          });

        ReactGA.event({
          category: 'Interactions',
          action: 'Click album',
          label: albumIndex,
        });

        if ((targetAlbum as LastFmAlbum).mbid) {
          navigateWithState(`/scrobble/album/view/mbid/${(targetAlbum as LastFmAlbum).mbid}`);
        } else if ((targetAlbum as DiscogsAlbum).discogsId) {
          navigateWithState(`/scrobble/album/view/dsid/${(targetAlbum as DiscogsAlbum).discogsId}`);
        } else {
          navigateWithState(
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
