import { Suspense, useContext, useEffect, useState } from 'react';
import { lazyWithPreload } from 'react-lazy-with-preload';
import { useDispatch } from 'react-redux';
import { Trans } from 'react-i18next';
import ReactGA from 'react-ga-neo';
import { get } from 'lodash-es';

import addSeconds from 'date-fns/addSeconds';
import addDays from 'date-fns/addDays';

import { Button, ButtonGroup, Form, FormGroup, Input, Label } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faExchangeAlt, faHeart, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';

import { useSettings } from 'hooks/useSettings';
import { enqueueScrobble } from 'store/actions/scrobbleActions';
import { createAlert, dismissAlert } from 'store/actions/alertActions';
import { ScrobbleCloneContext } from './ScrobbleSong';

import { DEFAULT_SONG_DURATION } from 'Constants';

import './SongForm.css';

import type { Scrobble } from 'utils/types/scrobble';

import { trackGetInfo } from 'utils/clients/lastfm/methods/trackGetInfo';
import { splitArtistTitleFromText } from 'utils/string';
import { SongMatch } from 'utils/types/string';

const DateTimePicker = lazyWithPreload(() => import('components/DateTimePicker'));
const Tooltip = lazyWithPreload(() => import('components/Tooltip'));

const controlOrder = ['artist', 'title', 'album']; // Used for arrow navigation

enum AutoFillStatus {
  Idle = '',
  Success = 'autofill-success',
  Fail = 'autofill-fail',
}

const reLastfmURL = /last\.fm(?:\/[a-zA-Z]{2})?\/music\/([^/]+)\/([^/]+?)\/([^/]+)/;
function parseLastFmUrl(url: string): SongMatch {
  const match = url.match(reLastfmURL);

  if (!match) {
    return null;
  }

  return {
    artist: decodeURIComponent(match[1].replace(/\+/g, ' ')),
    album: match[2] !== '_' ? decodeURIComponent(match[2].replace(/\+/g, ' ')) : undefined,
    title: decodeURIComponent(match[3].replace(/\+/g, ' ')),
  };
}

export function extractArtistTitle(text: string, reverse = false): SongMatch {
  return parseLastFmUrl(text) ?? splitArtistTitleFromText(text, reverse);
}

export function SongForm() {
  const [album, setAlbum] = useState('');
  const [artist, setArtist] = useState('');
  const [locks, setLocks] = useState({
    album: false,
    artist: false,
  });
  const [albumArtist, setAlbumArtist] = useState('');
  const [formIsValid, setFormValid] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date());
  const [title, setTitle] = useState('');
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [albumAutoFillStatus, setalbumAutoFillStatus] = useState(AutoFillStatus.Idle);

  const dispatch = useDispatch();
  const { isLoading: settingsLoading, settings } = useSettings();
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
    Tooltip.preload();
  }, []);

  useEffect(() => {
    if (isCustomDate) DateTimePicker.preload();
  }, [isCustomDate]);

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
        if (formIsValid) {
          if (!settingsLoading) {
            scrobbleSong();
          }
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
      if (splittedValues.album) {
        setAlbum(splittedValues.album);
      }

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

  const cloneDataFromScrobble = (scrobble: Partial<Scrobble>) => {
    setArtist(scrobble.artist);
    setTitle(scrobble.title);
    setAlbum(scrobble.album ?? album);
    setAlbumArtist(scrobble.albumArtist ?? albumArtist);
    if (scrobble.timestamp && scrobble.timestamp instanceof Date) {
      setTimestamp(scrobble.timestamp);
      setIsCustomDate(true);
    }
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

    ReactGA.event({
      category: 'Interactions',
      action: 'Manual scrobble',
    });

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
    setFormValid(artist.trim().length > 0 && title.trim().length > 0);
  };

  const autoFillAlbum = async () => {
    if (!formIsValid) {
      return;
    }
    const info = await trackGetInfo({ artist, title });
    const suggestedAlbum = get(info, 'album.title');

    if (suggestedAlbum === undefined) {
      setalbumAutoFillStatus(AutoFillStatus.Fail);
    } else {
      setalbumAutoFillStatus(AutoFillStatus.Success);
      setAlbum(suggestedAlbum);
    }
    setTimeout(() => setalbumAutoFillStatus(AutoFillStatus.Idle), 1200);
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
            className="has-button"
            data-cy="SongForm-artist"
            value={artist}
            onChange={(e) => setArtist((e.target as HTMLInputElement).value)}
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
            onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
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
            className={'has-two-buttons ' + albumAutoFillStatus}
            data-cy="SongForm-album"
            value={album}
            onChange={(e) => setAlbum((e.target as HTMLInputElement).value)}
            onKeyUp={catchKeys}
          />

          <div
            className={'lock-button rounded ' + albumAutoFillStatus}
            id="lock-album"
            data-cy="SongForm-album-lock"
            onClick={toggleLock('album')}
          >
            <FontAwesomeIcon className={locks.album ? 'active' : ''} icon={faThumbtack} />
          </div>
          <Tooltip target="lock-album">
            <Trans i18nKey="lockAlbum">Lock album</Trans>
          </Tooltip>

          <div
            className={'autofill-button rounded ' + albumAutoFillStatus}
            id="autofill-album"
            data-cy="SongForm-autofill-button"
            onClick={autoFillAlbum}
          >
            <FontAwesomeIcon
              icon={faWandMagicSparkles}
              className={formIsValid || albumAutoFillStatus === AutoFillStatus.Fail ? '' : 'disabled'}
            />
          </div>
          <Tooltip target="autofill-album">
            {formIsValid ? (
              <Trans i18nKey="autoFillAlbum">Fill album name from last.fm</Trans>
            ) : (
              <Trans i18nKey="autoFillAlbumInvalidForm">Enter artist and track for album auto-fill</Trans>
            )}
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
            className="has-button"
            data-cy="SongForm-albumArtist"
            value={albumArtist}
            onChange={(e) => setAlbumArtist((e.target as HTMLInputElement).value)}
            onKeyUp={catchKeys}
          />
        </div>
      </FormGroup>
      <FormGroup className="row">
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
              outline
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
              outline
            >
              <Trans i18nKey="custom">Custom</Trans>
            </Button>
          </ButtonGroup>
          {isCustomDate && (
            <Suspense
              fallback={
                <div>
                  <Trans i18nKey="loading">Loading...</Trans>
                </div>
              }
            >
              <DateTimePicker value={timestamp} onChange={setTimestamp} />
            </Suspense>
          )}
          <div className="row">
            <div className="col-12 mt-1">
              <FontAwesomeIcon icon={faLightbulb} />{' '}
              <Trans i18nKey="lastfmWillRejectOldTimestamps">Last.fm will reject scrobbles older than two weeks</Trans>
            </div>
          </div>
        </div>
      </FormGroup>

      <Button
        className="scrobble-button mt-2"
        tabIndex={4}
        color="success"
        onClick={scrobbleSong}
        data-cy="scrobble-button"
        disabled={!formIsValid || settingsLoading}
      >
        <Trans i18nKey="scrobble">Scrobble</Trans>!
      </Button>

      {!settings?.hasActiveSubscription && (
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
