import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';

import AlbumCard from 'components/AlbumCard';
import EditableText from 'components/EditableText';
import { useAlbumMutation } from 'hooks/useAlbumMutation';
import { formatDuration } from 'utils/datetime';

import type { ReactNode } from 'react';
import type { Album, DiscogsAlbum } from 'utils/types/album';
import type { Track } from 'utils/types/track';

export function AlbumMetadata({
  albumInfo,
  tracks,
  children,
}: {
  albumInfo: Album | null;
  tracks: Track[];
  children: ReactNode;
}) {
  const [totalDuration, setTotalDuration] = useState(0);
  const mutateAlbum = useAlbumMutation(albumInfo?.queryKey);
  const albumHasTracks = tracks?.length > 0;

  useEffect(() => {
    let newDuration = 0;
    if (albumHasTracks) {
      for (const track of tracks) {
        if (track.duration) {
          newDuration += track.duration;
        } else {
          newDuration = 0;
          break;
        }
      }
    }

    setTotalDuration(newDuration);
  }, [tracks, albumHasTracks]);

  const editAlbumTitle = (newAlbumTitle: string) => {
    mutateAlbum({
      info: {
        name: newAlbumTitle,
      },
    });
  };

  const editAlbumArtist = (newArtist: string) => {
    mutateAlbum({
      info: {
        artist: newArtist,
      },
    });
  };

  return (
    <div className="album-heading row my-2">
      <div className="col-3">
        <AlbumCard background={albumInfo.cover} sizes={albumInfo.coverSizes} />
      </div>
      <div className="col-9 d-flex flex-column">
        <div className="album-heading-info flex-grow-1">
          <h3 className="collection-heading-collection-name mb-0">
            <EditableText value={albumInfo.name} onEdit={editAlbumTitle} disabled={!albumHasTracks} />
          </h3>
          <div className="album-heading-artist-name">
            <EditableText value={albumInfo.artist} onEdit={editAlbumArtist} disabled={!albumHasTracks} />
          </div>
          {(albumInfo as DiscogsAlbum).releasedate && (
            <Badge className="my-1">{(albumInfo as DiscogsAlbum).releasedate}</Badge>
          )}
          {albumHasTracks && (
            <div className="album-heading-duration">
              <FontAwesomeIcon icon={faStopwatch} className="me-2" color="var(--bs-gray)" />
              {totalDuration ? formatDuration(totalDuration) : <Trans i18nKey="unknown">Unknown</Trans>}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
