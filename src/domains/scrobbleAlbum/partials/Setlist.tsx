import ScrobbleList from 'components/ScrobbleList';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import lazyWithPreload from 'react-lazy-with-preload';
import type { SetTrack, Setlist } from 'utils/types/setlist';
import { Track } from 'utils/types/track';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import { Badge } from 'reactstrap';
import { SetlistFmArtist } from 'utils/types/artist';

const DateTimePicker = lazyWithPreload(() => import('components/DateTimePicker'));

export default function SetlistViewer({ setlist }: { setlist: Setlist | null }) {
  // const [customTimestamp, setCustomTimestamp] = useState(new Date());
  // const [useCustomTimestamp, setUseCustomTimestamp] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [allTracks, setAllTracks] = useState([]);
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

  const toggleSelectTrack = (trackId: string, wasCheckedBefore = false) => {
    const newSet = new Set(selectedTracks);

    if (wasCheckedBefore) {
      newSet.delete(trackId);
    } else {
      newSet.add(trackId);
    }
    setSelectedTracks(newSet);
  };

  // const toggleSelectAll =

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

  useEffect(() => {
    const { fullSongList, idSet } = getAllTracks();
    setAllTracks(fullSongList);
    setSelectedTracks(idSet);
  }, [setlist]);

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
      {/* <div className="col-3">
            <ArtistCard artist={setlist.artist} artistId={setlist.artist.mbid} className={"col-3"}onClick={null} />
     </div> */}
      {true && (
        <div className="setlist-heading-info flex-grow-1">
          <h3 className="collection-heading-collection-name mb-0">{setlist.tour}</h3>
          <h3 className="setlist-heading-artist-name">{setlist.artist.name}</h3>
          <Badge className="my-1">{format(setlist.eventDate, 'MM/dd/yyyy')}</Badge>
        </div>
      )}

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
