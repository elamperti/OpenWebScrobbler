import { useDispatch } from 'react-redux';
import { Trans } from 'react-i18next';
import ReactGA from 'react-ga-neo';
import { get } from 'lodash-es';

import { enqueueScrobble } from 'store/actions/scrobbleActions';

import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import getYear from 'date-fns/getYear';

import { Button, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label } from 'reactstrap';
import { Fragment, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faCompactDisc,
  faEllipsisH,
  faInbox,
  faRedoAlt,
  faShoppingCart,
  faSquare,
  faSync,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { faClock, faCopy } from '@fortawesome/free-regular-svg-icons';
import { getAmznLink } from 'Constants';
import { breakStringUsingPattern, cleanTitleWithPattern } from 'domains/scrobbleAlbum/CleanupContext';

import type { Scrobble } from 'utils/types/scrobble';

import './ScrobbleItem.css';
import { useSettings } from 'hooks/useSettings';

interface ScrobbleItemProps {
  scrobble: Scrobble;
  cleanupPattern?: RegExp;
  compact?: boolean;
  hideArtist?: boolean;
  muteArtist?: boolean;
  noCover?: boolean;
  noMenu?: boolean;
  onSelect?: (uuid: string, selected: boolean) => void;
  selected?: boolean;
  cloneScrobbleTo?: (scrobble: Scrobble) => void;
  analyticsEvent?: string;
  lazyScrollPosition?: any;
}

export default function ScrobbleItem({
  scrobble,
  cleanupPattern,
  compact = false,
  hideArtist = false,
  muteArtist = false,
  noCover = false,
  noMenu = false,
  onSelect,
  selected = false,
  cloneScrobbleTo,
  analyticsEvent = 'Scrobble again',
  lazyScrollPosition,
}: ScrobbleItemProps) {
  const [hasScrobbledAgain, setHasScrobbledAgain] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { settings } = useSettings();
  const dispatch = useDispatch();

  const cloneScrobble = () => {
    ReactGA.event({
      category: 'Interactions',
      action: 'Clone track',
    });
    // Hack: the timestamp is ketp in compact mode (profile view) and removed when not (profile view)
    cloneScrobbleTo?.(compact ? scrobble : { ...scrobble, timestamp: undefined });
  };

  const toggleMoreMenu = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const scrobbleAgain = () => {
    const useOriginalTimestamp = noMenu ? get(settings, 'keepOriginalTimestamp') : false;
    ReactGA.event({
      category: 'Interactions',
      action: analyticsEvent,
    });
    enqueueScrobble(dispatch)([
      {
        ...scrobble,
        title: cleanTitleWithPattern(scrobble.title, cleanupPattern),
        timestamp: useOriginalTimestamp ? scrobble.timestamp : new Date(),
      },
    ]);
    setHasScrobbledAgain(true);
  };

  const properCase = (str: string, forceUcfirstMode = false) => {
    if (!str) return '';
    if (str.match(/[A-Z]/u)) {
      return str;
    } else if (forceUcfirstMode) {
      return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    }
    return str.replace(/\w+\b/g, (word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
  };

  const strikethroughMatch = (text: string, pattern?: RegExp) => {
    return breakStringUsingPattern(text, pattern).map(({ value, isMatch }, index) => (
      <Fragment key={index}>{!isMatch ? value : <del>{value}</del>}</Fragment>
    ));
  };

  let albumArt;
  let errorMessage;
  let rightSideContent;
  let selectionCheckbox;
  let songInfo;
  let songFullTitle;
  let statusIcon;
  let theTimestamp;
  let timestampFormat = '';

  if (noCover || compact) {
    albumArt = null;
  } else {
    const placeholderCDIcon = <FontAwesomeIcon size="3x" icon={faCompactDisc} />;
    albumArt = !scrobble.cover ? (
      placeholderCDIcon
    ) : (
      <LazyLoadImage
        className="cover rounded"
        src={scrobble.cover.sm || scrobble.cover}
        alt={scrobble.album}
        placeholder={placeholderCDIcon}
        scrollPosition={lazyScrollPosition}
        width="45"
        height="45"
        effect="opacity"
        async
      />
    );
  }

  if (scrobble.status) {
    switch (scrobble.status) {
      case 'success':
        statusIcon = faCheck;
        break;
      case 'retry':
        statusIcon = faSync;
        break;
      case 'error':
        statusIcon = faTimes;
        break;
      case 'pending':
        statusIcon = faCompactDisc;
        break;
      case 'queued':
        statusIcon = faInbox;
        break;
      default:
        statusIcon = null;
    }

    if (scrobble.status === 'error') {
      errorMessage = (
        <div className="error px-2">
          {scrobble.errorDescription && !scrobble.errorMessage ? <Trans i18nKey={scrobble.errorDescription} /> : null}
          {get(scrobble, 'errorMessage')}
        </div>
      );
    }
  }

  if (scrobble.timestamp) {
    const scrobbleDate = new Date(scrobble.timestamp);
    if (!isToday(scrobbleDate)) {
      timestampFormat = settings?.use12Hours ? 'M/d' : 'd/MM';
      if (getYear(scrobbleDate) < getYear(new Date())) {
        timestampFormat += '/yyyy';
      }
      timestampFormat += ' ';
    }
    timestampFormat += settings?.use12Hours ? 'hh:mm a' : 'HH:mm';
    theTimestamp = format(scrobbleDate, timestampFormat);
  } else {
    if (scrobble.duration > 0) {
      // Yes, there are songs over one hour. Is it worth making this more complex for those? (no, it isn't)
      const minutes = Math.floor(scrobble.duration / 60);
      const seconds = `0${scrobble.duration % 60}`.slice(-2);
      theTimestamp = `${minutes}:${seconds}`;
    } else {
      theTimestamp = '';
    }
  }

  const timeOrDuration = (
    <small
      className={`text-end timestamp d-flex align-items-center ${compact ? 'flex-row' : 'flex-row-reverse'} ${
        !scrobble.timestamp && 'duration text-muted'
      }`}
    >
      {scrobble.timestamp && <FontAwesomeIcon className={`${compact ? 'me-2' : 'ms-2'}`} icon={faClock} />}
      {theTimestamp}
    </small>
  );

  const formattedTitle = strikethroughMatch(properCase(scrobble.title, true), cleanupPattern);
  if (!hideArtist) {
    if (muteArtist) {
      songFullTitle = (
        <>
          {formattedTitle} <span className="text-muted">{properCase(scrobble.artist)}</span>
        </>
      );
    } else {
      songFullTitle = (
        <>
          {properCase(scrobble.artist)} - {formattedTitle}
        </>
      );
    }
  } else {
    songFullTitle = formattedTitle;
  }

  const scrobbleItemInputId = `ScrobbleItem-checkbox-${scrobble.uuid}`;

  if (compact) {
    // COMPACT view
    songInfo = (
      <Label className="d-flex align-items-center mb-0" htmlFor={scrobbleItemInputId}>
        {!!settings?.showTrackNumbers && scrobble.trackNumber && <span className="me-1">{scrobble.trackNumber}.</span>}
        <span className="song flex-grow-1 pe-2 truncate">{songFullTitle}</span>
        {timeOrDuration}
      </Label>
    );
  } else {
    // FULL view
    songInfo = (
      <>
        <span className="song flex-grow-1 pe-2 truncate">{songFullTitle}</span>
        <Label className="d-flex mb-0" htmlFor={scrobbleItemInputId}>
          <small className="text-muted flex-grow-1 truncate album">
            {scrobble.album && (
              <>
                <FontAwesomeIcon className="me-1" icon={faCompactDisc} transform="shrink-4" mask={faSquare} />
                {properCase(scrobble.album, true)}
                {scrobble.albumArtist ? ` - ${properCase(scrobble.albumArtist, true)}` : ''}
              </>
            )}
          </small>
          {timeOrDuration}
        </Label>
      </>
    );
  }

  if (noMenu) {
    rightSideContent = (
      <Button
        onClick={scrobbleAgain}
        size="sm"
        color="success"
        className="quick-scrobble-button"
        outline
        disabled={hasScrobbledAgain}
      >
        {hasScrobbledAgain ? <FontAwesomeIcon icon={faCheck} /> : <Trans i18nKey="scrobble">Scrobble</Trans>}
      </Button>
    );
  } else {
    rightSideContent = (
      <div>
        <Dropdown isOpen={dropdownOpen} toggle={toggleMoreMenu}>
          <DropdownToggle
            tag="div"
            onClick={toggleMoreMenu}
            aria-expanded={dropdownOpen}
            data-cy="ScrobbleItem-toggle-menu"
          >
            <Button className="btn-more" size="sm" color="secondary" outline>
              <FontAwesomeIcon icon={faEllipsisH} />
            </Button>
          </DropdownToggle>
          <DropdownMenu end data-cy="ScrobbleItem-menu">
            <DropdownItem onClick={scrobbleAgain}>
              <FontAwesomeIcon icon={faRedoAlt} className="me-2" />
              <Trans i18nKey="scrobbleAgain">Scrobble again</Trans>
            </DropdownItem>
            <DropdownItem tag="a" href={getAmznLink(scrobble.artist, scrobble.album)} target="_blank" rel="noopener">
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              <Trans i18nKey="buyOnAmzn" />
            </DropdownItem>
            {cloneScrobbleTo && (
              <>
                <DropdownItem key="cloneDivider" divider />
                <DropdownItem key="clone" onClick={cloneScrobble}>
                  <FontAwesomeIcon icon={faCopy} className="me-2" />
                  <Trans i18nKey="copyToEditor">Copy to editor</Trans>
                </DropdownItem>
              </>
            )}
          </DropdownMenu>
        </Dropdown>
        <span className="status-icon">
          {statusIcon && <FontAwesomeIcon size="xs" icon={statusIcon} spin={statusIcon === faCompactDisc} />}
        </span>
      </div>
    );
  }

  if (onSelect) {
    selectionCheckbox = (
      <FormGroup check inline className="me-0">
        <Input
          type="checkbox"
          className="me-1"
          checked={selected}
          onChange={() => onSelect(scrobble.uuid, selected)}
          id={scrobbleItemInputId}
        />
      </FormGroup>
    );
  }

  const scrobbleItemClasses = `scrobbled-item status-${scrobble.status} ${compact ? 'compact' : 'card mb-2'}`;

  return (
    <div className={scrobbleItemClasses} data-cy="ScrobbleItem">
      <div className={`d-flex flex-row align-items-center p-2 ${compact ? 'flex-wrap' : ''}`}>
        {selectionCheckbox}
        {albumArt && <div className="albumArt align-self-center pe-2">{albumArt}</div>}
        <div className="flex-grow-1 truncate">{songInfo}</div>
        <div className="ms-auto ps-2">{rightSideContent}</div>
      </div>
      {errorMessage}
    </div>
  );
}
