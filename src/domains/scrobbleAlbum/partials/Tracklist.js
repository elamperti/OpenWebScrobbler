import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Trans, Translation, useTranslation } from 'react-i18next';
import ReactGA from 'react-ga';
import addSeconds from 'date-fns/add_seconds';
import subSeconds from 'date-fns/sub_seconds';

import { Alert, Button, FormGroup, CustomInput } from 'reactstrap';

import { faArrowLeft, faBolt, faCompactDisc, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AlbumCard from 'components/AlbumCard';
import DateTimePicker from 'components/DateTimePicker';
import ScrobbleList from 'components/ScrobbleList';

import { enqueueScrobble } from 'store/actions/scrobbleActions';

// ToDo: refactor this component completely.
// It's too complex and carries several blocks from old code.

export default function Tracklist({ albumInfo, tracks }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [showTimestampCopy, setShowTimestampCopy] = useState(false);
  const [canScrobble, setCanScrobble] = useState(true);
  // ToDo: simplify customTimestamp + useCustomTimestamp
  const [customTimestamp, setCustomTimestamp] = useState(new Date());
  const [useCustomTimestamp, setUseCustomTimestamp] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState(new Set());
  const albumIsEmpty = tracks.length === 0;

  const goBack = (e) => {
    e.preventDefault();
    history.goBack();
  };

  const toggleCustomTimestamp = () => {
    if (!useCustomTimestamp) {
      ReactGA.event({
        category: 'Interactions',
        action: 'Use custom timestamp',
        label: 'Album',
      });
    }
    setUseCustomTimestamp(!useCustomTimestamp);
  };

  const toggleTimestampCopy = () => {
    setShowTimestampCopy(!showTimestampCopy);
  };

  const toggleSelectedTrack = (trackUUID, wasCheckedBefore) => {
    const newSet = new Set(selectedTracks);

    if (wasCheckedBefore) {
      newSet.delete(trackUUID);
    } else {
      newSet.add(trackUUID);
    }

    setSelectedTracks(newSet);
  };

  const handleTimestampChange = (newTimestamp) => {
    setCustomTimestamp(newTimestamp);
    setCanScrobble(true);
  };

  const scrobbleSelectedTracks = () => {
    const userHasNotSelectedTracks = selectedTracks.size < 1;
    const timestampCalculationSubstractsTime = !useCustomTimestamp;
    const albumName = albumInfo.name || '';
    const tracklist = tracks.slice(0);
    let rollingTimestamp = useCustomTimestamp ? customTimestamp : new Date();
    const tracksToScrobble = [];

    if (timestampCalculationSubstractsTime) {
      // When the user specifies a custom timestamp it will be the one of the first track,
      // so we'll be adding track.duration to that starting timestamp. In the other case,
      // when the timestamp is `now`, you've just listened to all those tracks, so the most
      // recent track for you is the last one of the album/selection.
      tracklist.reverse();
    }

    for (const track of tracklist) {
      if (userHasNotSelectedTracks || selectedTracks.has(track.uuid)) {
        const newTrack = {
          ...track,
          album: albumName,
          timestamp: rollingTimestamp,
        };

        // Adds the track to the array keeping timestamps chronological
        if (timestampCalculationSubstractsTime) {
          tracksToScrobble.unshift(newTrack);
        } else {
          tracksToScrobble.push(newTrack);
        }

        // Prepare timestamp for next track
        rollingTimestamp = timestampCalculationSubstractsTime
          ? subSeconds(rollingTimestamp, track.duration)
          : addSeconds(rollingTimestamp, track.duration);
      }
    }

    enqueueScrobble(dispatch)(tracksToScrobble);
    setCanScrobble(selectedTracks.size > 0);
    setSelectedTracks(new Set());
    setShowTimestampCopy(false);
  };

  return (
    <React.Fragment>
      <div className="album-heading row my-2">
        <div className="col-3">
          <AlbumCard background={albumInfo.cover} />
        </div>
        <div className="col-9 d-flex flex-column">
          <div className="album-heading-info flex-grow-1">
            <h3 className="album-heading-album-name mb-0">{albumInfo.name}</h3>
            <div className="album-heading-artist-name">{albumInfo.artist}</div>
          </div>
          <FormGroup className="align-self-end mb-0">
            <Translation>
              {
                // This mess is required to translate the `label` properties using t(), otherwise label wouldn't be clickable
                (t) => {
                  return (
                    <React.Fragment>
                      <CustomInput
                        inline
                        type="radio"
                        id="useNowTimestamp"
                        label={t('now')}
                        name="useCustomTimestamp"
                        checked={!useCustomTimestamp}
                        onChange={toggleCustomTimestamp}
                        disabled={albumIsEmpty}
                      ></CustomInput>
                      <CustomInput
                        inline
                        type="radio"
                        id="useCustomTimestamp"
                        label={t('customTimestamp')}
                        name="useCustomTimestamp"
                        checked={useCustomTimestamp}
                        onChange={toggleCustomTimestamp}
                        disabled={albumIsEmpty}
                      ></CustomInput>
                    </React.Fragment>
                  );
                }
              }
            </Translation>
            <FontAwesomeIcon
              id="timestampInfoIcon"
              icon={faQuestionCircle}
              color="var(--gray)"
              onClick={toggleTimestampCopy}
            />
          </FormGroup>
        </div>
      </div>

      <DateTimePicker value={customTimestamp} onChange={handleTimestampChange} visible={useCustomTimestamp} />
      <Alert
        color="dark"
        isOpen={showTimestampCopy}
        toggle={toggleTimestampCopy}
        className="text-justify mt-3"
        fade={false}
      >
        <Trans i18nKey="albumTimestampLogicDescription" />
      </Alert>
      <div className="row">
        <div className="my-2 col-12 col-sm-9 offset-sm-3 col-lg-6 offset-lg-6">
          <Button className="w-100 mr-3" color="success" onClick={scrobbleSelectedTracks} disabled={!canScrobble}>
            <Trans i18nKey={selectedTracks.size > 0 ? 'scrobbleSelected' : 'scrobbleAlbum'}>Scrobble it</Trans>
          </Button>
        </div>
      </div>

      <ScrobbleList
        compact
        isAlbum
        noMenu
        analyticsEventForScrobbles="Scrobble individual album song"
        scrobbles={tracks || []}
        onSelect={toggleSelectedTrack}
        selected={selectedTracks}
      >
        <div className="row">
          <div className="col-12 text-center mt-4">
            <FontAwesomeIcon icon={faBolt} transform="shrink-8 up-3 right-4 rotate-30" mask={faCompactDisc} size="4x" />
            <p className="mt-2">
              <Trans i18nKey="emptyAlbum">This album appears to be empty.</Trans>
            </p>
            <a href="/scrobble/album" onClick={goBack} className="my-2">
              <FontAwesomeIcon icon={faArrowLeft} />
              {` ${t('goBack')}`}
            </a>
          </div>
        </div>
      </ScrobbleList>
    </React.Fragment>
  );
}

Tracklist.propTypes = {
  albumInfo: PropTypes.object,
  tracks: PropTypes.array,
};
