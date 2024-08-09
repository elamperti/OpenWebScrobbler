import { useContext } from 'react';

import ScrobbleItem from 'components/ScrobbleItem';
import Spinner from 'components/Spinner';
import { ScrobbleCloneContext } from 'domains/scrobbleSong/ScrobbleSong';

import type { ReactNode } from 'react';

interface ScrobbleListProps {
  analyticsEventForScrobbles?: string;
  children: ReactNode;
  compact?: boolean;
  isAlbum?: boolean;
  loading?: boolean;
  noMenu?: boolean;
  onSelect?: (scrobble: any) => void;
  selected?: Set<string>;
  scrobbles?: any[];
  scrobblesCleanupPattern?: string;
}

export default function ScrobbleList({
  analyticsEventForScrobbles,
  children,
  compact = false,
  isAlbum = false,
  loading = false,
  noMenu = false,
  onSelect,
  selected,
  scrobbles = [],
  scrobblesCleanupPattern,
}: ScrobbleListProps) {
  const { cloneFn, setCloneFn } = useContext(ScrobbleCloneContext);
  let albumHasVariousArtists = !isAlbum;

  if (loading) {
    return <Spinner />;
  }

  if (scrobbles.length > 0) {
    if (isAlbum) {
      const albumArtistName = scrobbles[0].artist;

      for (let i = 1; i < scrobbles.length; i++) {
        if (scrobbles[i].artist !== albumArtistName) {
          albumHasVariousArtists = true;
          break;
        }
      }
    }

    const ScrobbleListContent = scrobbles.map((scrobble, i) => {
      return (
        <ScrobbleItem
          scrobble={scrobble}
          cleanupPattern={scrobblesCleanupPattern}
          analyticsEvent={analyticsEventForScrobbles}
          cloneScrobbleTo={setCloneFn ? cloneFn : undefined}
          compact={compact}
          noMenu={noMenu}
          noCover={isAlbum}
          onSelect={onSelect}
          selected={selected && selected.has(scrobble.uuid)}
          key={(scrobble.timestamp || 0) + i}
          muteArtist={isAlbum}
          hideArtist={!albumHasVariousArtists}
        />
      );
    });
    return (
      <div className="ScrobbleList">
        <div className={`d-flex ${isAlbum ? 'flex-column' : 'flex-column-reverse'}`}>{ScrobbleListContent}</div>
      </div>
    );
  } else {
    return children;
  }
}
