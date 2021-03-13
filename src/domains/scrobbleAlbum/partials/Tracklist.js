import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Trans, Translation, useTranslation } from 'react-i18next';
import ReactGA from 'react-ga';
import addSeconds from 'date-fns/add_seconds';
import subSeconds from 'date-fns/sub_seconds';
import format from 'date-fns/format';

import { Alert, Badge, Button, FormGroup, CustomInput } from 'reactstrap';

import {
  faArrowLeft,
  faBolt,
  faCompactDisc,
  faShoppingCart,
  faStopwatch,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AlbumCard from 'components/AlbumCard';
import DateTimePicker from 'components/DateTimePicker';
import ScrobbleList from 'components/ScrobbleList';

import { enqueueScrobble } from 'store/actions/scrobbleActions';

import { DEFAULT_SONG_DURATION, getAmznLink } from 'Constants';

// ToDo: refactor this component completely.
// It's too complex and carries several blocks from old code.

export default function Tracklist({ albumInfo, tracks }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [showTimestampCopy, setShowTimestampCopy] = useState(false);
  const [amznLink, setAmznLink] = useState('');
  const [canScrobble, setCanScrobble] = useState(true);
  // ToDo: simplify customTimestamp + useCustomTimestamp
  const [customTimestamp, setCustomTimestamp] = useState(new Date());
  const [useCustomTimestamp, setUseCustomTimestamp] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState(new Set());
  const [totalDuration, setTotalDuration] = useState(0);
  const albumHasTracks = tracks && tracks.length > 0;
  const durationFormat = totalDuration > 3600 ? 'h:mm:ss' : 'mm:ss'; // ToDo: use formatDuration after upgrading date-fns to ^2.19

  useEffect(() => {
    setAmznLink(getAmznLink(albumInfo.artist, albumInfo.name));
  }, [albumInfo]);

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
  }, [albumHasTracks, tracks]);

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
    const tracklist = Array.from(tracks);
    let rollingTimestamp = useCustomTimestamp ? customTimestamp : new Date();
    if (timestampCalculationSubstractsTime) {
      // When the user specifies a custom timestamp it will be the one of the first track,
      // so we'll be adding track.duration to that starting timestamp. In the other case,
      // when the timestamp is `now`, the user has just listened to all those tracks, so
      // the most recent track will be the last one of the album/selection.
      tracklist.reverse();
    }

    const tracksToScrobble = tracklist
      .filter(({ uuid }) => userHasNotSelectedTracks || selectedTracks.has(uuid))
      .reduce((result, track) => {
        const newTrack = {
          ...track,
          album: albumName,
          timestamp: rollingTimestamp,
        };

        // Prepare timestamp for next track
        rollingTimestamp = timestampCalculationSubstractsTime
          ? subSeconds(rollingTimestamp, track.duration || DEFAULT_SONG_DURATION)
          : addSeconds(rollingTimestamp, track.duration || DEFAULT_SONG_DURATION);

        // Adds the track to the array keeping timestamps chronological
        if (timestampCalculationSubstractsTime) {
          result.unshift(newTrack);
        } else {
          result.push(newTrack);
        }

        return result;
      }, []);

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
            <Badge className="my-1">{albumInfo.releasedate}</Badge>
            {tracks.length > 0 && (
              <div className="album-heading-duration">
                <FontAwesomeIcon icon={faStopwatch} className="mr-2" color="var(--gray)" />
                {totalDuration ? (
                  format(addSeconds(new Date(0), totalDuration), durationFormat)
                ) : (
                  <Trans i18nKey="unknown">Unknown</Trans>
                )}
              </div>
            )}
          </div>
          {albumHasTracks && (
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
                        ></CustomInput>
                        <CustomInput
                          inline
                          type="radio"
                          id="useCustomTimestamp"
                          label={t('customTimestamp')}
                          name="useCustomTimestamp"
                          checked={useCustomTimestamp}
                          onChange={toggleCustomTimestamp}
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
          )}
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
      {albumHasTracks && (
        <div className="row">
          <div className="my-2 col-3 col-lg-2 offset-lg-4 pr-0 text-right">
            {amznLink && (
              <a
                href={getAmznLink(albumInfo.artist, albumInfo.name)}
                className="w-100 btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
                title={t('buyOnAmzn')}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
              </a>
            )}
          </div>
          <div className="my-2 col-9 col-lg-6">
            <Button className="w-100 mr-3" color="success" onClick={scrobbleSelectedTracks} disabled={!canScrobble}>
              <Trans i18nKey={selectedTracks.size > 0 ? 'scrobbleSelected' : 'scrobbleAlbum'}>Scrobble it</Trans>
            </Button>
          </div>
        </div>
      )}

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
