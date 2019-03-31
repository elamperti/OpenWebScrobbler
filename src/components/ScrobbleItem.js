import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ReactGA from 'react-ga';
import get from 'lodash/get';

import { enqueueScrobble } from 'store/actions/scrobbleActions';

import format from 'date-fns/format';
import isToday from 'date-fns/is_today';

import {
  Button,
  CustomInput,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faInbox,
  faTimes,
  faCompactDisc,
  faSquare,
  faSync,
  faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import {
  faClock,
} from '@fortawesome/free-regular-svg-icons';

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
      action: 'Clone track'
    });
    this.props.cloneScrobbleTo(this.props.scrobble);
  }

  toggleMoreMenu() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  scrobbleAgain() {
    const useOriginalTimestamp = this.props.noMenu ? get(this.props.settings, 'keepOriginalTimestamp') : false;

    ReactGA.event({
      category: 'Interactions',
      action: this.props.analyticsEvent,
    });
    this.props.enqueueScrobble([{
      ...this.props.scrobble,
      timestamp: useOriginalTimestamp ? this.props.scrobble.timestamp : new Date(),
    }]);
    this.setState({
      hasScrobbledAgain: true,
    });
  }

  properCase(str, forceUcfirstMode=false) {
    if (str.match(/[A-Z]/u)) { // ToDo: use \p{Uppercase} once it can be compiled #future
      return str;
    } else if (forceUcfirstMode) {
      return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    }
    return str.replace(/\w+\b/g, (word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
  }

  render() {
    const t = this.props.t; // Translations
    const scrobble = this.props.scrobble;
    let albumArt;
    let albumInfo;
    let cloneOption;
    let errorMessage;
    let rightSideContent;
    let scrobbleItemClasses;
    let selectionCheckbox;
    let songInfo;
    let songFullTitle;
    let statusIcon;
    let theTimestamp;
    let timeOrDuration;
    let timestampFormat='';

    if (scrobble.album) {
      albumInfo = (
        <span>
          <FontAwesomeIcon className="mr-1" icon={faCompactDisc} transform="shrink-4" mask={faSquare} />
          {this.properCase(scrobble.album, true)}
          {scrobble.albumArtist ? ` - ${this.properCase(scrobble.albumArtist, true)}` : ''}
        </span>
      );
    }

    if (this.props.noCover || this.props.compact) {
      albumArt = null;
    } else {
      if (scrobble.cover) {
        albumArt = <img className="cover rounded" src={scrobble.cover} alt={scrobble.album} />;
      } else {
        albumArt = <FontAwesomeIcon size="3x" icon={faCompactDisc} />;
      }
    }

    if (scrobble.status) {
      switch (scrobble.status) {
        case 'success':
          statusIcon = (<FontAwesomeIcon size="xs" icon={faCheck} />);
          break;
        case 'retry':
          statusIcon = (<FontAwesomeIcon size="xs" icon={faSync} />);
          break;
        case 'error':
          statusIcon = (<FontAwesomeIcon size="xs" icon={faTimes} />);
          break;
        case 'pending':
          statusIcon = (<FontAwesomeIcon size="xs" spin icon={faCompactDisc} />);
          break;
        case 'queued':
          statusIcon = (<FontAwesomeIcon size="xs" icon={faInbox} />);
          break;
        default:
          statusIcon = null;
      }

      if (scrobble.status === 'error' && scrobble.errorDescription) {
        errorMessage = (
          <div className="error px-2">
            {t(scrobble.errorDescription)}
          </div>
        );
      }
    }

    if (this.props.cloneScrobbleTo) {
      cloneOption = [
        <DropdownItem key="cloneDivider" divider />,
        <DropdownItem key="clone" onClick={this.cloneScrobble}>{t('copyToEditor')}</DropdownItem>,
      ];
    }

    if (scrobble.timestamp) {
      if (!isToday(scrobble.timestamp)) {
        timestampFormat = 'D/MM ';
      }
      timestampFormat += this.props.settings.use12Hours ? 'h:mm A' : 'H:mm';
      theTimestamp = format(scrobble.timestamp, timestampFormat);
    } else {
      // Yes, there are songs over one hour. Is it worth making this more complex for those? (no, it isn't)
      let minutes = Math.floor(scrobble.duration / 60);
      let seconds = `0${scrobble.duration % 60}`.slice(-2);
      theTimestamp = `${minutes}:${seconds}`;
    }
    timeOrDuration = (
      <small className={`text-right timestamp d-flex align-items-center ${this.props.compact ? 'flex-row' : 'flex-row-reverse'} ${!scrobble.timestamp && 'duration text-muted'}`}>
        {scrobble.timestamp && <FontAwesomeIcon className={`${this.props.compact ? 'mr-2' : 'ml-2'}`} icon={faClock} />}
        {theTimestamp}
      </small>
    );

    if (!this.props.hideArtist) {
      if (this.props.muteArtist) {
        songFullTitle = (
          <React.Fragment>
            {this.properCase(scrobble.title, true)}
            {' '}<span className="text-muted">{this.properCase(scrobble.artist)}</span>
          </React.Fragment>
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
          <span className="song flex-grow-1 pr-2 truncate">
            {songFullTitle}
          </span>
          {timeOrDuration}
        </div>
      );
    } else {
      // FULL view
      songInfo = (
        <React.Fragment>
          <span className="song">
            {songFullTitle}
          </span>
          <div className="d-flex">
            <small className="text-muted flex-grow-1 truncate album">
              {albumInfo}
            </small>
            {timeOrDuration}
          </div>
        </React.Fragment>
      );
    }

    scrobbleItemClasses = `scrobbled-item status-${scrobble.status} ` + (this.props.compact ? 'compact' : 'card mb-2');

    if (this.props.noMenu) {
      rightSideContent = (
        <Button onClick={this.scrobbleAgain} size="sm" color="success" className="quick-scrobble-button" outline disabled={this.state.hasScrobbledAgain}>
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
            <DropdownMenu right>
              <DropdownItem onClick={this.scrobbleAgain}>{t('scrobbleAgain')}</DropdownItem>
              { cloneOption }
            </DropdownMenu>
          </Dropdown>
          <span className="status-icon">
            {statusIcon}
          </span>
        </div>
      );
    }

    if (this.props.onSelect) {
      selectionCheckbox = (
        <CustomInput inline type="checkbox" className="mr-1" checked={this.props.selected} onChange={() => this.props.onSelect(this.props.uuid, this.props.selected)} id={`ScrobbleItem-checkbox-${this.props.uuid}`} />
      );
    }

    // ToDo: evaluate using flex-nowrap instead of flex-wrap
    return (
      <div className={scrobbleItemClasses}>
        <div className={`d-flex flex-row align-items-center p-2 ${this.props.compact ? 'flex-wrap' : ''}`}>
          {selectionCheckbox}
          { albumArt ? <div className="albumArt align-self-center pr-2">{albumArt}</div> : null }
          <div className="flex-grow-1 truncate">
            {songInfo}
          </div>
          <div className="ml-auto pl-2">
            {rightSideContent}
          </div>
        </div>
        {errorMessage}
      </div>
    );
  }
}

ScrobbleItem.propTypes = {
  analyticsEvent: PropTypes.string,
  cloneScrobbleTo: PropTypes.func,
  compact: PropTypes.bool,
  hideArtist: PropTypes.bool,
  uuid: PropTypes.string,
  muteArtist: PropTypes.bool,
  onSelect: PropTypes.func,
  noCover: PropTypes.bool,
  noMenu: PropTypes.bool,
  selected: PropTypes.bool,
  scrobble: PropTypes.object.isRequired,
}

ScrobbleItem.defaultProps = {
  analyticsEvent: 'Scrobble again',
  compact: false,
  hideArtist: false,
  muteArtist: false,
  noCover: false,
  noMenu: false,
  selected: false,
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    enqueueScrobble: enqueueScrobble(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  translate(['common'])(ScrobbleItem)
);
