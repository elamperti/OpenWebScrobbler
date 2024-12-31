import { useContext } from 'react';

import { ScrobbleItem } from 'components/ScrobbleItem';
import Spinner from 'components/Spinner';
import { ScrobbleCloneContext } from 'domains/scrobbleSong/ScrobbleSong';

import type { ReactNode } from 'react';
import { CleanupPatternContext } from 'domains/scrobbleAlbum/CleanupContext';

interface ScrobbleListProps {
  analyticsEventForScrobbles?: string;
  children: ReactNode;
  compact?: boolean;
  isAlbum?: boolean;
  loading?: boolean;
  noMenu?: boolean;
  albumHasVariousArtists?: boolean;
  onSelect?: (scrobble: any) => void;
  selected?: Set<string>;
  scrobbles?: any[];
}

export default function ScrobbleList({
  analyticsEventForScrobbles,
  children,
  compact = false,
  isAlbum = false,
  albumHasVariousArtists = false,
  loading = false,
  noMenu = false,
  onSelect,
  selected,
  scrobbles = [],
}: ScrobbleListProps) {
  const { cloneFn, setCloneFn } = useContext(ScrobbleCloneContext);
  const cleanupCtx = useContext(CleanupPatternContext); // this may be undefined

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
          analyticsEvent={analyticsEventForScrobbles}
          cleanupPattern={cleanupCtx?.cleanupPattern}
          cloneScrobbleTo={setCloneFn ? cloneFn : undefined}
          compact={compact}
          noMenu={noMenu}
          noCover={isAlbum}
          onSelect={onSelect}
          selected={selected && selected.has(scrobble.id)}
          key={(scrobble.timestamp || 0) + i}
          muteArtist={isAlbum}
          hideArtist={isAlbum && !albumHasVariousArtists}
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
