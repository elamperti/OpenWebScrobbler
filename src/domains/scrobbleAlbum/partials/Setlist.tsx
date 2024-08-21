import ScrobbleList from 'components/ScrobbleList';
import { useState } from 'react';

import lazyWithPreload from 'react-lazy-with-preload';
import type { SetTrack, Setlist, SetlistFmArtist } from 'utils/types/setlist';
import { Track } from 'utils/types/track';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';

const DateTimePicker = lazyWithPreload(() => import('components/DateTimePicker'));

export default function SetlistViewer({ setlist }: { setlist: Setlist | null }) {
  // const [customTimestamp, setCustomTimestamp] = useState(new Date());
  // const [useCustomTimestamp, setUseCustomTimestamp] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  // const [totalDuration, setTotalDuration] = useState(0);
  // const setlistHasTracks = setlist && setlist.sets.length > 0;
  // const durationFormat = totalDuration > 3600 ? 'H:mm:ss' : 'mm:ss';

  DateTimePicker.preload();

  // const toggleCustomTimestamp = () => {
  //   if (!useCustomTimestamp) {
  //     ReactGA.event({
  //       category: 'Interactions',
  //       action: 'Use custom timestamp',
  //       label: 'Album',
  //     });
  //   }
  //   setUseCustomTimestamp(!useCustomTimestamp);
  // };

  const toggleSelectedTrack = (trackUUID: string, wasCheckedBefore = false) => {
    const newSet = new Set(selectedTracks);

    if (wasCheckedBefore) {
      newSet.delete(trackUUID);
    } else {
      newSet.add(trackUUID);
    }

    setSelectedTracks(newSet);
  };

  const allTracks = getAllTracks();

  function getAllTracks() {
    const fullSongList: Track[] = [];
    const artist = setlist.artist;
    for (const set of setlist.sets) {
      for (const song of set.songs) {
        fullSongList.push(songToTrack({ song, concertArtist: artist }));
      }
      fullSongList.concat();
    }
    return fullSongList;
  }

  function songToTrack({ song, concertArtist }: { song: SetTrack; concertArtist: SetlistFmArtist }) {
    let ourArtist = concertArtist.name;
    if ('originalArtist' in song) {
      ourArtist = song.originalArtist.name;
    }
    return {
      id: null,
      artist: ourArtist,
      trackNumber: null,
      title: song.name,
      album: null,
      albumArtist: ourArtist,
      duration: null,
    } as Track;
  }

  return (
    <>
      {/* {hasSetlistInfo && (

    )} */}

      <ScrobbleList
        compact={true}
        isAlbum={true}
        noMenu
        analyticsEventForScrobbles="Scrobble individual setlist song"
        scrobbles={allTracks || []}
        albumHasVariousArtists={true}
        onSelect={toggleSelectedTrack}
        selected={selectedTracks}
      >
        <EmptyScrobbleListFiller />
      </ScrobbleList>
    </>
  );
}
