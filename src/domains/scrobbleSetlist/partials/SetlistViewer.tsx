import { useEffect, useState } from 'react';
import { addSeconds, subDays } from 'date-fns';
import { Trans } from 'react-i18next';
import lazyWithPreload from 'react-lazy-with-preload';
import { useDispatch } from 'react-redux';

import { Button } from 'reactstrap';

import ScrobbleList from 'components/ScrobbleList';
import { enqueueScrobble } from 'store/actions/scrobbleActions';

import { EmptySetlistMessage } from './EmptySetlistMessage';
import { SetlistCard } from './SetlistCard';

import { DEFAULT_CONCERT_INTERVAL_DURATION, DEFAULT_SONG_DURATION } from 'Constants';

import type { Setlist } from 'utils/types/setlist';
import type { TrackID } from 'utils/types/track';

const DateTimePicker = lazyWithPreload(() => import('components/DateTimePicker'));

export default function SetlistViewer({ setlist }: { setlist: Setlist | null }) {
  const dispatch = useDispatch();
  const [selectedTracks, setSelectedTracks] = useState<Set<TrackID>>(new Set());
  const [customTimestamp, setCustomTimestamp] = useState(() => {
    const twoWeeksAgo = subDays(new Date(), 14);
    return setlist.date && setlist.date > twoWeeksAgo ? setlist.date : new Date();
  });
  const [hasBeenScrobbled, setSetlistScrobbled] = useState(false);
  const setlistIsValid = setlist.trackCount > 0;

  const tracks = setlist.tracks || [];

  DateTimePicker.preload();

  const toggleSelectedTrack = (scrobbleId: TrackID, wasCheckedBefore = false) => {
    const newSet = new Set(selectedTracks);

    if (wasCheckedBefore) {
      newSet.delete(scrobbleId);
    } else {
      newSet.add(scrobbleId);
    }

    setSelectedTracks(newSet);
  };

  const scrobbleSelectedTracks = () => {
    const usingCustomSelection = selectedTracks.size < 1 && selectedTracks.size === tracks.length;
    let rollingTimestamp = customTimestamp;
    const tracksToScrobble = tracks
      .filter(({ id }) => usingCustomSelection || selectedTracks.has(id))
      .reduce((result, track) => {
        const newTrack = {
          ...track,
          timestamp: rollingTimestamp,
        };

        // Prepare timestamp for next track.
        rollingTimestamp = addSeconds(
          rollingTimestamp,
          (track.duration || DEFAULT_SONG_DURATION) + DEFAULT_CONCERT_INTERVAL_DURATION
        );
        result.push(newTrack);
        return result;
      }, []);

    enqueueScrobble(dispatch)(tracksToScrobble);
    setSetlistScrobbled(true);
    setSelectedTracks(new Set());
  };

  useEffect(() => {
    setSelectedTracks(new Set(setlist.tracks?.map(({ id }) => id) || []));
  }, [setlist]);

  return (
    <>
      <SetlistCard linkArtist className="mt-1 border-0" setlist={setlist} />
      {setlistIsValid && <DateTimePicker value={customTimestamp} onChange={setCustomTimestamp} />}

      <div className="row">
        <div className="my-2 col-9 col-lg-6 offset-lg-6">
          <Button
            className="w-100 me-3"
            color="success"
            onClick={scrobbleSelectedTracks}
            disabled={hasBeenScrobbled || !setlistIsValid}
          >
            <Trans
              i18nKey={
                selectedTracks.size > 0 && selectedTracks.size < tracks.length ? 'scrobbleSelected' : 'scrobbleSetlist'
              }
            >
              Scrobble setlist
            </Trans>
          </Button>
        </div>
      </div>

      <ScrobbleList
        compact={true}
        isAlbum={true}
        noMenu
        analyticsEventForScrobbles="Scrobble individual setlist song"
        scrobbles={tracks || []}
        albumHasVariousArtists={true}
        onSelect={toggleSelectedTrack}
        selected={selectedTracks}
      >
        <EmptySetlistMessage />
      </ScrobbleList>
    </>
  );
}
