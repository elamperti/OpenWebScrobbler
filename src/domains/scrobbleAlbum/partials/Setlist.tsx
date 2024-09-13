import ScrobbleList from 'components/ScrobbleList';
import { useEffect, useState } from 'react';
import { addSeconds } from 'date-fns';

import lazyWithPreload from 'react-lazy-with-preload';
import type { SetTrack, Setlist } from 'utils/types/setlist';
import { Track } from 'utils/types/track';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import { Button } from 'reactstrap';
import { SetlistFmArtist } from 'utils/types/artist';
import { Trans } from 'react-i18next';
import { DEFAULT_CONCERT_SONG_BUFFER, DEFAULT_SONG_DURATION } from 'Constants';
import { enqueueScrobble } from 'store/actions/scrobbleActions';
import { useDispatch } from 'react-redux';

const DateTimePicker = lazyWithPreload(() => import('components/DateTimePicker'));

export default function SetlistViewer({ setlist }: { setlist: Setlist | null }) {
  const dispatch = useDispatch();
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [allTracks, setAllTracks] = useState([]);
  const [customTimestamp, setCustomTimestamp] = useState(setlist.eventDate);

  DateTimePicker.preload();

  const toggleSelectTrack = (trackId: string, wasCheckedBefore = false) => {
    const newSet = new Set(selectedTracks);

    if (wasCheckedBefore) {
      newSet.delete(trackId);
    } else {
      newSet.add(trackId);
    }
    setSelectedTracks(newSet);
  };

  function getAllTracks() {
    const fullSongList: Track[] = [];
    const idSet: Set<string> = new Set();
    const artist = setlist.artist;
    let counter = 0;
    for (const set of setlist.sets) {
      for (const song of set.songs) {
        fullSongList.push(songToTrack({ song, concertArtist: artist, num: counter }));
        idSet.add(counter.toString());
        counter++;
      }
      fullSongList.concat();
    }
    return { fullSongList, idSet };
  }

  const handleTimestampChange = (newTimestamp) => {
    setCustomTimestamp(newTimestamp);
  };

  const scrobbleSelectedTracks = () => {
    const usingCustomSelection = selectedTracks.size < 1 && selectedTracks.size === allTracks.length;
    let rollingTimestamp = customTimestamp;
    const tracksToScrobble = allTracks
      .filter(({ id }) => usingCustomSelection || selectedTracks.has(id))
      .reduce((result, track) => {
        const newTrack = {
          ...track,
          timestamp: rollingTimestamp,
        };

        // Prepare timestamp for next track.
        rollingTimestamp = addSeconds(
          rollingTimestamp,
          (track.duration || DEFAULT_SONG_DURATION) + DEFAULT_CONCERT_SONG_BUFFER
        );
        result.push(newTrack);
        return result;
      }, []);

    enqueueScrobble(dispatch)(tracksToScrobble);
    setSelectedTracks(new Set());
  };

  useEffect(() => {
    const { fullSongList, idSet } = getAllTracks();
    setAllTracks(fullSongList);
    setSelectedTracks(idSet);
  }, [setlist, getAllTracks]);

  function songToTrack({ song, concertArtist, num }: { song: SetTrack; concertArtist: SetlistFmArtist; num: number }) {
    let ourArtist = concertArtist.name;
    if ('originalArtist' in song) {
      ourArtist = song.originalArtist.name;
    }
    return {
      id: num.toString(),
      artist: ourArtist,
      trackNumber: num,
      title: song.name,
      album: null,
      albumArtist: ourArtist,
      duration: null,
    } as Track;
  }

  return (
    <>
      {true && (
        <div className="setlist-heading-info flex-grow-1">
          <h3 className="collection-heading-collection-name mb-0">{setlist.tour}</h3>
          <h3 className="setlist-heading-artist-name">{setlist.artist.name}</h3>
        </div>
      )}
      <DateTimePicker value={customTimestamp} onChange={handleTimestampChange} />

      <div className="row">
        <div className="my-2 col-9 col-lg-6 offset-lg-6">
          <Button
            className="w-100 me-3"
            color="success"
            onClick={scrobbleSelectedTracks}
            disabled={allTracks.length < 1}
          >
            <Trans
              i18nKey={
                selectedTracks.size > 0 && selectedTracks.size < allTracks.length
                  ? 'scrobbleSelected'
                  : 'scrobbleSetlist'
              }
            >
              Scrobble it
            </Trans>
          </Button>
        </div>
      </div>

      <ScrobbleList
        compact={true}
        isAlbum={true}
        noMenu
        analyticsEventForScrobbles="Scrobble individual setlist song"
        scrobbles={allTracks || []}
        albumHasVariousArtists={true}
        onSelect={toggleSelectTrack}
        selected={selectedTracks}
      >
        <EmptyScrobbleListFiller />
      </ScrobbleList>
    </>
  );
}
