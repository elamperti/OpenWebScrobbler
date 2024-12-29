import { Trans } from 'react-i18next';
import { get } from 'lodash-es';

import { useSettings } from 'hooks/useSettings';

import { Input, FormGroup, Label } from 'reactstrap';
import { Fragment } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc, faSquare } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { breakStringUsingPattern } from 'domains/scrobbleAlbum/CleanupContext';

import { properCase } from 'utils/string';
import { formatDuration, formatScrobbleTimestamp } from 'utils/datetime';
import type { Scrobble } from 'utils/types/scrobble';

import { useScrobbleAgain } from './useScrobbleAgain';

import { ScrobbleItemMenu } from './partials/ScrobbleItemMenu';
import { ScrobbleStatusIcon } from './partials/ScrobbleStatusIcon';
import { ScrobbleAgainButton } from './partials/ScrobbleAgainButton';
import './ScrobbleItem.css';

interface ScrobbleItemProps {
  scrobble: Scrobble;
  cleanupPattern?: RegExp;
  compact?: boolean;
  hideArtist?: boolean;
  muteArtist?: boolean;
  noCover?: boolean;
  noMenu?: boolean;
  onSelect?: (track: Scrobble, selected: boolean) => void;
  selected?: boolean;
  cloneScrobbleTo?: (scrobble: Scrobble) => void;
  analyticsEvent?: string;
  lazyScrollPosition?: any;
}

const placeholderCDIcon = <FontAwesomeIcon size="3x" icon={faCompactDisc} />;

const strikethroughMatch = (text: string, pattern?: RegExp) => {
  return breakStringUsingPattern(text, pattern).map(({ value, isMatch }, index) => (
    <Fragment key={index}>{!isMatch ? value : <del>{value}</del>}</Fragment>
  ));
};

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
  analyticsEvent,
  lazyScrollPosition,
}: ScrobbleItemProps) {
  const { settings } = useSettings();
  const useOriginalTimestamp = noMenu ? get(settings, 'keepOriginalTimestamp') : false;
  const scrobbleAgain = useScrobbleAgain(scrobble, useOriginalTimestamp, analyticsEvent, cleanupPattern);

  const showAlbumArt = !compact && !noCover;
  const scrobbleItemInputId = `ScrobbleItem-checkbox-${scrobble.uuid}`;
  const properTitle = properCase(scrobble.title, true);
  const formattedTitle = cleanupPattern ? strikethroughMatch(properTitle, cleanupPattern) : properTitle;

  const timeOrDuration = (
    <small
      className={`text-end timestamp d-flex align-items-center ${compact ? 'flex-row' : 'flex-row-reverse'} ${
        !scrobble.timestamp && 'duration text-muted'
      }`}
    >
      {scrobble.timestamp && (
        <>
          <FontAwesomeIcon className={`${compact ? 'me-2' : 'ms-2'}`} icon={faClock} />
          {formatScrobbleTimestamp(scrobble.timestamp, settings?.use12Hours)}
        </>
      )}
      {!scrobble.timestamp && scrobble.duration > 0 && formatDuration(scrobble.duration)}
    </small>
  );

  const songFullTitle = hideArtist ? (
    formattedTitle
  ) : muteArtist ? (
    <>
      {formattedTitle} <span className="text-muted">{properCase(scrobble.artist)}</span>
    </>
  ) : (
    `${properCase(scrobble.artist)} - ${formattedTitle}`
  );

  return (
    <div
      className={`scrobbled-item status-${scrobble.status} ${compact ? 'compact' : 'card mb-2'}`}
      data-cy="ScrobbleItem"
    >
      <div className={`d-flex flex-row align-items-center p-2${compact ? ' flex-wrap' : ''}`}>
        {/* Select checkbox */}
        {onSelect && (
          <FormGroup check inline className="me-0">
            <Input
              type="checkbox"
              className="me-1"
              checked={selected}
              onChange={() => onSelect(scrobble, selected)}
              id={scrobbleItemInputId}
            />
          </FormGroup>
        )}

        {/* Album art */}
        {showAlbumArt && (
          <div className="albumArt align-self-center pe-2">
            {!scrobble.cover ? (
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
            )}
          </div>
        )}

        {/* Main content */}
        <div className="flex-grow-1 truncate">
          {compact ? (
            <Label className="d-flex mb-0 align-items-center" htmlFor={scrobbleItemInputId}>
              {!!settings?.showTrackNumbers && scrobble.trackNumber && (
                <span className="me-1">{scrobble.trackNumber}.</span>
              )}
              <span className="song flex-grow-1 pe-2 truncate">{songFullTitle}</span>
              {timeOrDuration}
            </Label>
          ) : (
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
          )}
        </div>

        {/* Right side content */}
        <div className="ms-auto ps-2">
          {noMenu ? (
            <ScrobbleAgainButton onScrobble={scrobbleAgain} />
          ) : (
            <>
              <ScrobbleItemMenu scrobble={scrobble} scrobbleAgain={scrobbleAgain} cloneScrobbleTo={cloneScrobbleTo} />
              <ScrobbleStatusIcon status={scrobble.status} />
            </>
          )}
        </div>
      </div>

      {scrobble.status === 'error' && (
        <div className="error px-2">
          {scrobble.errorDescription && !scrobble.errorMessage ? <Trans i18nKey={scrobble.errorDescription} /> : null}
          {get(scrobble, 'errorMessage')}
        </div>
      )}
    </div>
  );
}
