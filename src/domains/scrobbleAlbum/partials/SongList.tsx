import ScrobbleList from 'components/ScrobbleList';
import { Scrobble } from 'utils/types/scrobble';
import { Track } from 'utils/types/track';
import { EmptyDiscMessage } from './EmptyDiscMessage';

export default function SongList({ tracks }: { tracks: Track[] | Scrobble[] }) {
  return (
    <>
      <ScrobbleList
        compact
        isAlbum
        noMenu
        analyticsEventForScrobbles="Scrobble individual album song"
        scrobbles={tracks || []}
        onSelect={undefined}
        selected={undefined}
      >
        <EmptyDiscMessage />
      </ScrobbleList>
    </>
  );
}
