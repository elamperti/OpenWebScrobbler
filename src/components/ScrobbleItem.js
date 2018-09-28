import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ReactGA from 'react-ga';

import { enqueueScrobble } from 'store/actions/scrobbleActions';

import format from 'date-fns/format';
import isToday from 'date-fns/is_today';

import {
  Button,
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

    this.toggleMoreMenu = this.toggleMoreMenu.bind(this);
    this.scrobbleAgain = this.scrobbleAgain.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggleMoreMenu() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  scrobbleAgain() {
    ReactGA.event({
      category: 'Interactions',
      action: 'Scrobble Again'
    });
    this.props.enqueueScrobble([{
      ...this.props.scrobble,
      timestamp: new Date(),
    }]);
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
    let albumInfo, albumArt, statusIcon, errorMessage;
    let theTimestamp, timestampFormat='';

    if (scrobble.album) {
      albumInfo = (
        <span>
          <FontAwesomeIcon className="mr-1" icon={faCompactDisc} transform="shrink-4" mask={faSquare} />
          {this.properCase(scrobble.album, true)}
          {scrobble.albumArtist ? ` - ${this.properCase(scrobble.albumArtist, true)}` : ''}
        </span>
      );
    }

    if (!scrobble.cover) {
      albumArt = (
        <FontAwesomeIcon size="3x" icon={faCompactDisc} />
      );
    } else {
      albumArt = (
        <img
          className="cover rounded"
          src={scrobble.cover}
          alt={scrobble.album}
        />
      )
    }

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
      default:
      case 'queued':
        statusIcon = (<FontAwesomeIcon size="xs" icon={faInbox} />);
        break;
    }

    if (scrobble.status === 'error' && scrobble.errorDescription) {
      errorMessage = (
        <div className="error px-2">
          {t(scrobble.errorDescription)}
        </div>
      );
    }

    if (!isToday(scrobble.timestamp)) {
      timestampFormat = 'D/MM ';
    }
    timestampFormat += this.props.settings.use12Hours ? 'h:mm A' : 'H:mm';
    theTimestamp = format(scrobble.timestamp, timestampFormat);

    return (
      <div className={`scrobbled-item card mb-2 status-${scrobble.status}`}>
        <div className="d-flex flex-row p-2">
          <div className="albumArt align-self-center pr-2">
            {albumArt}
          </div>
          <div className="flex-grow-1 truncate">
            <span className="song">
              {this.properCase(scrobble.artist)} - {this.properCase(scrobble.title, true)}
            </span>
            <div className="d-flex">
              <small className="text-muted flex-grow-1 truncate album">
                {albumInfo}
              </small>
              <small className="text-right timestamp">
                {theTimestamp}&nbsp;
                <FontAwesomeIcon icon={faClock} />
              </small>
            </div>
          </div>

          <div className="ml-auto pl-2">
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleMoreMenu}>
            <DropdownToggle tag="div"
              onClick={this.toggleMoreMenu}
              aria-expanded={this.state.dropdownOpen}
            >
              <Button className="btn-more" size="sm" color="secondary" outline>
                <FontAwesomeIcon icon={faEllipsisH} />
              </Button>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={this.scrobbleAgain}>
                {t('scrobbleAgain')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <span className="status-icon">
            {statusIcon}
          </span>
          </div>
        </div>
        {errorMessage}
      </div>
    );
  }
}

ScrobbleItem.propTypes = {
  scrobble: PropTypes.object.isRequired,
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
