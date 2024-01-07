import { Suspense, useContext, useEffect, useState } from 'react';
import { lazyWithPreload } from 'react-lazy-with-preload';
import { useDispatch } from 'react-redux';
import { Trans } from 'react-i18next';
import ReactGA from 'react-ga-neo';

import addSeconds from 'date-fns/addSeconds';
import addDays from 'date-fns/addDays';

import { Button, ButtonGroup, Form, FormGroup, Input, Label } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faExchangeAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';

import { useSettings } from 'hooks/useSettings';
import { enqueueScrobble } from 'store/actions/scrobbleActions';
import { createAlert, dismissAlert } from 'store/actions/alertActions';
import { ScrobbleCloneContext } from './ScrobbleSong';

import { DEFAULT_SONG_DURATION } from 'Constants';

import './SongForm.css';

const DateTimePicker = lazyWithPreload(() => import('components/DateTimePicker'));
const Tooltip = lazyWithPreload(() => import('components/Tooltip'));

const reAutoPasteSplitting = / - | ?[–—] ?/;
const controlOrder = ['artist', 'title', 'album']; // Used for arrow navigation

export function extractArtistTitle(text: string, reverse = false) {
  if (reAutoPasteSplitting.test(text)) {
    const result = text.split(reAutoPasteSplitting, 2);

    if (reverse) {
      result.reverse();
    }

    return { artist: result[0], title: result[1] };
  }

  return null;
}

export function SongForm() {
  const [album, setAlbum] = useState('');
  const [artist, setArtist] = useState('');
  const [locks, setLocks] = useState({
    album: false,
    artist: false,
  });
  const [albumArtist, setAlbumArtist] = useState('');
  const [canScrobble, setCanScrobble] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date());
  const [title, setTitle] = useState('');
  const [isCustomDate, setIsCustomDate] = useState(false);

  const dispatch = useDispatch();
  const { settings } = useSettings();
  const { setCloneFn } = useContext(ScrobbleCloneContext);

  // ToDo: refactor to use context or something more practical
  useEffect(() => {
    if (setCloneFn) {
      setCloneFn(() => cloneDataFromScrobble);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCloneFn]);

  useEffect(() => {
    document.getElementById('artist').focus();
    DateTimePicker.preload();
    Tooltip.preload();
  }, []);

  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist, title, album]);

  /*
    Handling of keyboard events. These are binded to onKeyUp instead of onKeyDown
    because if the key is Enter (scrobble song) the state update should be fired
    before scrobbleSong() is called
  */
  const catchKeys = (event) => {
    /* eslint-disable default-case */
    switch (event.keyCode) {
      case 38: // Up arrow
        {
          const prevControl = controlOrder[(controlOrder.indexOf(event.target.id) + 2) % 3];
          document.getElementById(prevControl).focus();
        }
        break;
      case 40: // Down arrow
        {
          const nextControl = controlOrder[(controlOrder.indexOf(event.target.id) + 1) % 3];
          document.getElementById(nextControl).focus();
        }
        break;
      case 13: // Enter key
        if (canScrobble) {
          scrobbleSong();
        } else if (event.target.id === 'artist') {
          document.getElementById('title').focus();
        }
        break;
    }
  };

  const catchPaste = (event) => {
    if (!settings?.catchPaste || artist || title) return;

    const targetField = event.target.id;
    const textToSplit = event.clipboardData.getData('Text').trim();

    const splittedValues = extractArtistTitle(textToSplit, targetField === 'title');

    if (splittedValues) {
      // Save previous state to allow undoing the change
      const prevState = {
        artist,
        title,
        [targetField]: textToSplit,
      };

      setArtist(splittedValues.artist);
      setTitle(splittedValues.title);

      const undoPaste = () => {
        cloneDataFromScrobble(prevState);
        dispatch(dismissAlert({ category: 'paste' }));
      };

      dispatch(
        createAlert({
          type: 'info',
          category: 'paste',
          rawMessage: (
            <div>
              <Trans i18nKey="pasteIntercepted">Paste intercepted!</Trans> ✨
              <span onClick={undoPaste} className="ms-2 alert-link SongForm-PasteAlert">
                <Trans i18nKey="undo">Undo</Trans>
              </span>
            </div>
          ),
        })
      );

      validateForm();

      event.preventDefault(); // avoids the call to onChange handler
    }
  };

  const cloneDataFromScrobble = (scrobble) => {
    setArtist(scrobble.artist);
    setTitle(scrobble.title);
    setAlbum(scrobble.album ?? album);
    setAlbumArtist(scrobble.albumArtist ?? albumArtist);
    validateForm();
  };

  const scrobbleSong = () => {
    enqueueScrobble(dispatch)([
      {
        artist,
        title,
        album,
        albumArtist,
        timestamp: isCustomDate ? timestamp : new Date(),
      },
    ]);

    // Close paste alert if it exists
    dispatch(
      dismissAlert({
        category: 'paste',
      })
    );

    // Reset state
    setTitle('');
    if (!locks.artist) {
      setArtist('');
    }
    if (!locks.album) {
      setAlbum('');
      setAlbumArtist('');
    }

    if (isCustomDate) {
      const newTimestamp = addSeconds(timestamp, DEFAULT_SONG_DURATION);

      if (newTimestamp > addDays(new Date(), 1)) {
        // Goes too much into the future, disable custom timestamp
        setIsCustomDate(false);
      } else {
        setTimestamp(newTimestamp);
      }
    }

    document.getElementById(locks.artist ? 'title' : 'artist').focus();
  };

  const swapArtistTitle = () => {
    const newArtist = title;
    setTitle(artist);
    setArtist(newArtist);

    ReactGA.event({
      category: 'Interactions',
      action: 'Swap',
    });
  };

  const toggleLock = (field) => {
    return () => {
      setLocks({
        ...locks,
        [field]: !locks[field],
      });

      ReactGA.event({
        category: 'Interactions',
        action: 'Lock',
        label: field,
      });
    };
  };

  const toggleTimestampMode = () => {
    if (!isCustomDate) {
      ReactGA.event({
        category: 'Interactions',
        action: 'Use custom timestamp',
        label: 'Song',
      });
    }

    setIsCustomDate(!isCustomDate);
    setTimestamp(new Date());
  };

  const validateForm = () => {
    let formIsValid = false;

    if (artist.trim().length > 0 && title.trim().length > 0) {
      formIsValid = true;
    }

    setCanScrobble(formIsValid);
  };

  return (
    <Form className="SongForm" data-cy="SongForm">
      <FormGroup className="row">
        <Label for="artist" className="col-sm-3 required">
          <Trans i18nKey="artist">Artist</Trans>
        </Label>
        <div className="col-10 col-sm-8 p-0 input-with-lock">
          <Input
            bsSize="sm"
            type="text"
            name="artist"
            id="artist"
            tabIndex={1}
            className="hasLock"
            data-cy="SongForm-artist"
            value={artist}
            onChange={() => {}}
            onInput={(e) => setArtist((e.target as HTMLInputElement).value)}
            onKeyUp={catchKeys}
            onPaste={catchPaste}
          />
          <div
            className="lock-button rounded"
            id="lock-artist"
            data-cy="SongForm-artist-lock"
            onClick={toggleLock('artist')}
          >
            <FontAwesomeIcon className={locks.artist ? 'active' : ''} icon={faThumbtack} />
          </div>
          <Tooltip target="lock-artist">
            <Trans i18nKey="lockArtist">Lock artist</Trans>
          </Tooltip>
        </div>
        <div className="col-1 swaptool-top">
          <span>⏋</span>
          <Button onClick={swapArtistTitle} data-cy="SongForm-swap" id="btn-swap" size="sm">
            <FontAwesomeIcon rotation={90} icon={faExchangeAlt} />
          </Button>
        </div>
        <Tooltip placement="left" target="btn-swap">
          <Trans i18nKey="swapArtistTitle">Swap artist and track</Trans>
        </Tooltip>
      </FormGroup>
      <FormGroup className="row">
        <Label for="title" className="col-sm-3 required">
          <Trans i18nKey="title">Title</Trans>
        </Label>
        <div className="col-10 col-sm-8 p-0">
          <Input
            bsSize="sm"
            type="text"
            name="title"
            id="title"
            tabIndex={2}
            data-cy="SongForm-title"
            value={title}
            onChange={() => {}}
            onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
            onKeyUp={catchKeys}
            onPaste={catchPaste}
          />
        </div>
        <div className="col-1 swaptool-bottom">
          <span>⏌</span>
        </div>
      </FormGroup>
      <FormGroup className="row">
        <Label for="album" className="col-sm-3">
          <Trans i18nKey="album">Album</Trans>
        </Label>
        <div className="col-sm-9 p-0 input-with-lock">
          <Input
            bsSize="sm"
            type="text"
            name="album"
            id="album"
            tabIndex={3}
            className="hasLock"
            data-cy="SongForm-album"
            value={album}
            onChange={() => {}}
            onInput={(e) => setAlbum((e.target as HTMLInputElement).value)}
            onKeyUp={catchKeys}
          />
          <div
            className="lock-button rounded"
            id="lock-album"
            data-cy="SongForm-album-lock"
            onClick={toggleLock('album')}
          >
            <FontAwesomeIcon className={locks.album ? 'active' : ''} icon={faThumbtack} />
          </div>
          <Tooltip target="lock-album">
            <Trans i18nKey="lockAlbum">Lock album</Trans>
          </Tooltip>
        </div>
      </FormGroup>
      <FormGroup className="row">
        <Label for="album" className="col-sm-3">
          <Trans i18nKey="albumArtist">Album artist</Trans>
        </Label>
        <div className="col-sm-9 p-0">
          <Input
            bsSize="sm"
            type="text"
            name="albumArtist"
            id="albumArtist"
            tabIndex={3}
            className="hasLock"
            data-cy="SongForm-albumArtist"
            value={albumArtist}
            onChange={() => {}}
            onInput={(e) => setAlbumArtist((e.target as HTMLInputElement).value)}
            onKeyUp={catchKeys}
          />
        </div>
      </FormGroup>
      <FormGroup className="row">
        <Suspense
          fallback={
            <div>
              <Trans i18nKey="loading">Loading...</Trans>
            </div>
          }
        >
          <Label className="col-sm-3">
            <Trans i18nKey="timestamp">Timestamp</Trans>
          </Label>
          <div className="col-sm-9 p-0">
            <ButtonGroup className="w-100">
              <Button
                onClick={toggleTimestampMode}
                aria-pressed={!isCustomDate}
                data-cy="timestampMode-now"
                active={!isCustomDate}
                size="sm"
                className="w-50"
              >
                <Trans i18nKey="now">Now</Trans>
              </Button>
              <Button
                onClick={toggleTimestampMode}
                aria-pressed={isCustomDate}
                data-cy="timestampMode-custom"
                active={isCustomDate}
                size="sm"
                className="w-50"
              >
                <Trans i18nKey="custom">Custom</Trans>
              </Button>
            </ButtonGroup>
            <DateTimePicker value={timestamp} onChange={setTimestamp} visible={isCustomDate} />
            <div className="row">
              <div className="col-12 mt-1">
                <FontAwesomeIcon icon={faLightbulb} />{' '}
                <Trans i18nKey="lastfmWillRejectOldTimestamps">
                  Last.fm will reject scrobbles older than two weeks
                </Trans>
              </div>
            </div>
          </div>
        </Suspense>
      </FormGroup>

      <Button
        className="scrobble-button mt-2"
        tabIndex={4}
        color="success"
        onClick={scrobbleSong}
        data-cy="scrobble-button"
        disabled={!canScrobble}
      >
        <Trans i18nKey="scrobble">Scrobble</Trans>!
      </Button>

      {!settings?.isDonor && (
        <div className="donation-cta mt-2">
          <a href="https://www.patreon.com/OpenScrobbler" rel="noopener">
            <Trans i18nKey="considerDonating">Consider donating to the project!</Trans>
          </a>
          <FontAwesomeIcon icon={faHeart} />
        </div>
      )}
    </Form>
  );
}
