import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ReactGA from 'react-ga';
import get from 'lodash/get';

import { enqueueScrobble } from 'store/actions/scrobbleActions';

import format from 'date-fns/format';
import isToday from 'date-fns/isToday';

import { Button, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup } from 'reactstrap';
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

import './ScrobbleItem.css';

class ScrobbleItem extends Component {
  constructor(props) {
    super(props);

    this.cloneScrobble = this.cloneScrobble.bind(this);
    this.scrobbleAgain = this.scrobbleAgain.bind(this);
    this.toggleMoreMenu = this.toggleMoreMenu.bind(this);

    this.state = {
      hasScrobbledAgain: false,
      dropdownOpen: false,
    };
  }

  cloneScrobble() {
    ReactGA.event({
      category: 'Interactions',
      action: 'Clone track',
    });
    this.props.cloneScrobbleTo(this.props.scrobble);
  }

  toggleMoreMenu() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  scrobbleAgain() {
    const useOriginalTimestamp = this.props.noMenu ? get(this.props.settings, 'keepOriginalTimestamp') : false;
    ReactGA.event({
      category: 'Interactions',
      action: this.props.analyticsEvent,
    });
    this.props.enqueueScrobble([
      {
        ...this.props.scrobble,
        timestamp: useOriginalTimestamp ? this.props.scrobble.timestamp : new Date(),
      },
    ]);
    this.setState({
      hasScrobbledAgain: true,
    });
  }

  properCase(str, forceUcfirstMode = false) {
    // ToDo: use \p{Uppercase} once it can be compiled #future
    if (str.match(/[A-Z]/u)) {
      return str;
    } else if (forceUcfirstMode) {
      return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    }
    return str.replace(/\w+\b/g, (word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
  }

  render() {
    const t = this.props.t;
    const scrobble = this.props.scrobble;
    let albumArt;
    let errorMessage;
    let rightSideContent;
    let selectionCheckbox;
    let songInfo;
    let songFullTitle;
    let statusIcon;
    let theTimestamp;
    let timestampFormat = '';

    if (this.props.noCover || this.props.compact) {
      albumArt = null;
    } else {
      // ToDo: LazyLoadImage.src is using those two values to mitigate the transition between old and new structures.
      //       It should be safe to simplify some time from now.
      //       Worst case scenario it breaks the cover image of old scrobbles in history.
      const placeholderCDIcon = <FontAwesomeIcon size="3x" icon={faCompactDisc} />;
      albumArt = !scrobble.cover ? (
        placeholderCDIcon
      ) : (
        <LazyLoadImage
          className="cover rounded"
          src={scrobble.cover.sm || scrobble.cover}
          alt={scrobble.album}
          placeholder={placeholderCDIcon}
          scrollPosition={this.props.lazyScrollPosition}
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
            {scrobble.errorDescription && !scrobble.errorMessage ? t(scrobble.errorDescription) : null}
            {get(scrobble, 'errorMessage')}
          </div>
        );
      }
    }

    if (scrobble.timestamp) {
      if (!isToday(scrobble.timestamp)) {
        timestampFormat = 'd/MM ';
      }
      timestampFormat += this.props.settings.use12Hours ? 'h:mm a' : 'H:mm';
      theTimestamp = format(new Date(scrobble.timestamp), timestampFormat);
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
        className={`text-end timestamp d-flex align-items-center ${
          this.props.compact ? 'flex-row' : 'flex-row-reverse'
        } ${!scrobble.timestamp && 'duration text-muted'}`}
      >
        {scrobble.timestamp && <FontAwesomeIcon className={`${this.props.compact ? 'me-2' : 'ms-2'}`} icon={faClock} />}
        {theTimestamp}
      </small>
    );

    if (!this.props.hideArtist) {
      if (this.props.muteArtist) {
        songFullTitle = (
          <Fragment>
            {this.properCase(scrobble.title, true)}{' '}
            <span className="text-muted">{this.properCase(scrobble.artist)}</span>
          </Fragment>
        );
      } else {
        songFullTitle = `${this.properCase(scrobble.artist)} - ${this.properCase(scrobble.title, true)}`;
      }
    } else {
      songFullTitle = this.properCase(scrobble.title, true);
    }

    if (this.props.compact) {
      // COMPACT view
      songInfo = (
        <div className="d-flex align-items-center">
          <span className="song flex-grow-1 pe-2 truncate">{songFullTitle}</span>
          {timeOrDuration}
        </div>
      );
    } else {
      // FULL view
      songInfo = (
        <Fragment>
          <span className="song">{songFullTitle}</span>
          <div className="d-flex">
            <small className="text-muted flex-grow-1 truncate album">
              {scrobble.album && (
                <Fragment>
                  <FontAwesomeIcon className="me-1" icon={faCompactDisc} transform="shrink-4" mask={faSquare} />
                  {this.properCase(scrobble.album, true)}
                  {scrobble.albumArtist ? ` - ${this.properCase(scrobble.albumArtist, true)}` : ''}
                </Fragment>
              )}
            </small>
            {timeOrDuration}
          </div>
        </Fragment>
      );
    }

    const scrobbleItemClasses =
      `scrobbled-item status-${scrobble.status} ` + (this.props.compact ? 'compact' : 'card mb-2');

    if (this.props.noMenu) {
      rightSideContent = (
        <Button
          onClick={this.scrobbleAgain}
          size="sm"
          color="success"
          className="quick-scrobble-button"
          outline
          disabled={this.state.hasScrobbledAgain}
        >
          {this.state.hasScrobbledAgain ? <FontAwesomeIcon icon={faCheck} /> : t('scrobble')}
        </Button>
      );
    } else {
      rightSideContent = (
        <div>
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleMoreMenu}>
            <DropdownToggle tag="div" onClick={this.toggleMoreMenu} aria-expanded={this.state.dropdownOpen}>
              <Button className="btn-more" size="sm" color="secondary" outline>
                <FontAwesomeIcon icon={faEllipsisH} />
              </Button>
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem onClick={this.scrobbleAgain}>
                <FontAwesomeIcon icon={faRedoAlt} className="me-2" />
                {t('scrobbleAgain')}
              </DropdownItem>
              <DropdownItem tag="a" href={getAmznLink(scrobble.artist, scrobble.album)} target="_blank" rel="noopener">
                <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                {t('buyOnAmzn')}
              </DropdownItem>
              {this.props.cloneScrobbleTo && (
                <Fragment>
                  <DropdownItem key="cloneDivider" divider />
                  <DropdownItem key="clone" onClick={this.cloneScrobble}>
                    <FontAwesomeIcon icon={faCopy} className="me-2" />
                    {t('copyToEditor')}
                  </DropdownItem>
                </Fragment>
              )}
            </DropdownMenu>
          </Dropdown>
          <span className="status-icon">
            {statusIcon && <FontAwesomeIcon size="xs" icon={statusIcon} spin={statusIcon === faCompactDisc} />}
          </span>
        </div>
      );
    }

    if (this.props.onSelect) {
      selectionCheckbox = (
        <FormGroup check inline className="me-0">
          <Input
            type="checkbox"
            className="me-1"
            checked={this.props.selected}
            onChange={() => this.props.onSelect(this.props.uuid, this.props.selected)}
            id={`ScrobbleItem-checkbox-${this.props.uuid}`}
          />
        </FormGroup>
      );
    }

    // ToDo: evaluate using flex-nowrap instead of flex-wrap
    return (
      <div className={scrobbleItemClasses}>
        <div className={`d-flex flex-row align-items-center p-2 ${this.props.compact ? 'flex-wrap' : ''}`}>
          {selectionCheckbox}
          {albumArt && <div className="albumArt align-self-center pe-2">{albumArt}</div>}
          <div className="flex-grow-1 truncate">{songInfo}</div>
          <div className="ms-auto ps-2">{rightSideContent}</div>
        </div>
        {errorMessage}
      </div>
    );
  }
}

ScrobbleItem.defaultProps = {
  analyticsEvent: 'Scrobble again',
  compact: false,
  hideArtist: false,
  lazyScrollPosition: null,
  muteArtist: false,
  noCover: false,
  noMenu: false,
  selected: false,
};

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    enqueueScrobble: enqueueScrobble(dispatch),
  };
};

ScrobbleItem.propTypes = {
  analyticsEvent: PropTypes.string,
  cloneScrobbleTo: PropTypes.func,
  compact: PropTypes.bool,
  enqueueScrobble: PropTypes.func,
  hideArtist: PropTypes.bool,
  lazyScrollPosition: PropTypes.object,
  muteArtist: PropTypes.bool,
  noCover: PropTypes.bool,
  noMenu: PropTypes.bool,
  onSelect: PropTypes.func,
  scrobble: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  settings: PropTypes.shape({
    use12Hours: PropTypes.bool,
  }),
  t: PropTypes.func,
  uuid: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ScrobbleItem));
