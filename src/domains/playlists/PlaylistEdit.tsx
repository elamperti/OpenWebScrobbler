import { useQuery } from '@tanstack/react-query';
import Spinner from 'components/Spinner';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { playlistsGet } from 'utils/clients/api/methods/playlistsGet';
import type { Track } from 'utils/types/track';

export function PlaylistView() {
  const { playlistId } = useParams();
  const { isEditing, setIsEditing } = useState(false);
  const { playlistName, setPlaylistName } = useState('');
  const { tracklist, setTracklist } = useState<Track>([]);
  const { data, isFetching } = useQuery({
    queryKey: ['playlists', playlistId],
    queryFn: () => playlistsGet(playlistId),
    // staleTime: 1000 * 60 * 60 * 6, // hours
  });

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <section>
      <h2>
        <Trans i18nKey="myPlaylists">{playlistName}</Trans>
      </h2>
      <ul>
        {data.tracks.map((track, i) => (
          <li key={i}>
            {track.artist} - {track.title}
          </li>
        ))}
      </ul>
    </section>
  );
}
