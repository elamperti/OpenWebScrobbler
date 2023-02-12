import React, { useState, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { lazyWithPreload } from 'react-lazy-with-preload';
import { Trans, useTranslation } from 'react-i18next';
import ReactGA from 'react-ga';
import addSeconds from 'date-fns/addSeconds';
import subSeconds from 'date-fns/subSeconds';
import format from 'date-fns/format';

import { Alert, Badge, Button, FormGroup, Label, Input } from 'reactstrap';

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
import ScrobbleList from 'components/ScrobbleList';

import { enqueueScrobble } from 'store/actions/scrobbleActions';

import { DEFAULT_SONG_DURATION, getAmznLink } from 'Constants';

const DateTimePicker = lazyWithPreload(() => import('components/DateTimePicker'));

// ToDo: refactor this component completely.
// It's too complex and carries several blocks from old code.

export default function Tracklist({ albumInfo, tracks }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const hasAlbumInfo = Object.keys(albumInfo).length > 0;
  const durationFormat = totalDuration > 3600 ? 'H:mm:ss' : 'mm:ss'; // ToDo: use formatDuration after upgrading date-fns to ^2.19

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

  DateTimePicker.preload();

  const goBack = (e) => {
    e.preventDefault();
    navigate(-1);
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
      {hasAlbumInfo && (
        <div className="album-heading row my-2">
          <div className="col-3">
            <AlbumCard background={albumInfo.cover} sizes={albumInfo.coverSizes} />
          </div>
          <div className="col-9 d-flex flex-column">
            <div className="album-heading-info flex-grow-1">
              <h3 className="album-heading-album-name mb-0">{albumInfo.name}</h3>
              <div className="album-heading-artist-name">{albumInfo.artist}</div>
              <Badge className="my-1">{albumInfo.releasedate}</Badge>
              {tracks.length > 0 && (
                <div className="album-heading-duration">
                  <FontAwesomeIcon icon={faStopwatch} className="me-2" color="var(--bs-gray)" />
                  {totalDuration ? (
                    format(addSeconds(new Date(0), totalDuration), durationFormat)
                  ) : (
                    <Trans i18nKey="unknown">Unknown</Trans>
                  )}
                </div>
              )}
            </div>
            {albumHasTracks && (
              <div className="align-self-end mb-0">
                <FormGroup check inline>
                  <Input
                    type="radio"
                    id="useNowTimestamp"
                    name="useCustomTimestamp"
                    checked={!useCustomTimestamp}
                    onChange={toggleCustomTimestamp}
                  />
                  <Label for="useNowTimestamp" check>
                    <Trans i18nKey="now" />
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    type="radio"
                    id="useCustomTimestamp"
                    name="useCustomTimestamp"
                    checked={useCustomTimestamp}
                    onChange={toggleCustomTimestamp}
                  />
                  <Label for="useCustomTimestamp" check>
                    <Trans i18nKey="customTimestamp" />
                  </Label>
                </FormGroup>
                <FontAwesomeIcon
                  id="timestampInfoIcon"
                  icon={faQuestionCircle}
                  color="var(--bs-gray)"
                  onClick={toggleTimestampCopy}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <Suspense
        fallback={
          <div>
            <Trans i18nKey="loading">Loading...</Trans>
          </div>
        }
      >
        <DateTimePicker value={customTimestamp} onChange={handleTimestampChange} visible={useCustomTimestamp} />
      </Suspense>
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
          <div className="my-2 col-3 col-lg-2 offset-lg-4 pe-0 text-end">
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
            <Button className="w-100 me-3" color="success" onClick={scrobbleSelectedTracks} disabled={!canScrobble}>
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
