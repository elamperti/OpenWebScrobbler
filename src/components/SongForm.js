import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation, Trans } from 'react-i18next';
import ReactGA from 'react-ga';

import addSeconds from 'date-fns/add_seconds';
// import isFuture from 'date-fns/is_future';

import { Button, ButtonGroup, Form, FormGroup, Input, Label } from 'reactstrap';

import DateTimePicker from 'components/DateTimePicker';
import Tooltip from 'components/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import { faPatreon } from '@fortawesome/free-brands-svg-icons';

import { enqueueScrobble } from 'store/actions/scrobbleActions';
import { createAlert, dismissAlert } from 'store/actions/alertActions';

import { DEFAULT_SONG_DURATION } from 'Constants';

import './SongForm.css';

const controlOrder = ['artist', 'title', 'album']; // Used for arrow navigation

class SongForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      album: '',
      albumLocked: false,
      artist: '',
      artistLocked: false,
      albumArtist: '',
      canScrobble: false,
      timestamp: new Date(),
      title: '',
      undo: null,
      useCustomDate: false,
    };

    this.catchKeys = this.catchKeys.bind(this);
    this.catchPaste = this.catchPaste.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.insertData = this.insertData.bind(this);
    this.revertPaste = this.revertPaste.bind(this);
    this.scrobbleSong = this.scrobbleSong.bind(this);
    this.swapArtistTitle = this.swapArtistTitle.bind(this);
    this.toggleLock = this.toggleLock.bind(this);
    this.toggleTimestampMode = this.toggleTimestampMode.bind(this);
    this.validateForm = this.validateForm.bind(this);

    if (this.props.exportCloneReceiver) {
      this.props.exportCloneReceiver(this.insertData);
    }
  }

  componentDidMount() {
    document.getElementById('artist').focus();
  }

  /*
    Handling of keyboard events. These are binded to onKeyUp instead of onKeyDown
    because if the key is Enter (scrobble song) the state update should be fired
    before scrobbleSong() is called
  */
  catchKeys(event) {
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
        if (this.state.canScrobble) {
          this.scrobbleSong();
        } else if (event.target.id === 'artist') {
          document.getElementById('title').focus();
        }
        break;
    }
  }

  catchPaste(event) {
    if (!this.props.settings.catchPaste || this.state.artist || this.state.title) return;

    const splittedValues = /(.+) [-–—] (.+)/.exec(event.clipboardData.getData('Text').trim());
    let prevState;
    let pasteData;

    if (splittedValues) {
      // Assigns values depending on which field they were pasted on
      switch (event.target.id) {
        default:
        case 'artist':
          pasteData = {
            artist: splittedValues[1],
            title: splittedValues[2],
          };
          break;
        case 'title':
          pasteData = {
            artist: splittedValues[2],
            title: splittedValues[1],
          };
          break;
      }

      // Save previous state to allow undoing the change
      prevState = {
        artist: this.state.artist,
        title: this.state.title,
        album: this.state.album,
        albumArtist: this.state.albumArtist,
      };
      prevState[event.target.id] = event.clipboardData.getData('Text');

      this.setState(
        {
          ...pasteData,
          undo: prevState,
        },
        () => {
          this.props.createAlert({
            type: 'info',
            category: 'paste',
            rawMessage: (
              <div>
                <Trans i18nKey="pasteIntercepted">Paste intercepted!</Trans> ✨
                <span href="#" onClick={this.revertPaste} className="ml-2 alert-link">
                  <Trans i18nKey="undo">Undo</Trans>
                </span>
              </div>
            ),
          });
          this.validateForm();
        }
      );
      event.preventDefault(); // avoids the call to onChange handler
    }
  }

  handleTimeChange(newDate) {
    if (!this.state.useCustomDate) return;
    this.setState({
      timestamp: newDate,
    });
  }

  insertData(data) {
    this.setState(
      {
        album: '',
        albumLocked: false,
        artist: '',
        artistLocked: false,
        albumArtist: '',
        title: '',
        ...data,
        timestamp: this.state.useCustomDate ? new Date(data.timestamp) : this.state.timestamp,
      },
      () => this.validateForm()
    );
  }

  revertPaste() {
    this.setState(
      {
        ...this.state.undo,
        undo: null,
      },
      () => this.validateForm()
    );
    this.props.dismissAlert({
      category: 'paste',
    });
  }

  scrobbleSong() {
    const newState = {
      canScrobble: false,
      artist: '',
      title: '',
      album: '',
      albumArtist: '',
      undo: null,
    };

    this.props.enqueueScrobble([
      {
        artist: this.state.artist,
        title: this.state.title,
        album: this.state.album,
        albumArtist: this.state.albumArtist,
        timestamp: this.state.useCustomDate ? this.state.timestamp : new Date(),
      },
    ]);

    if (this.state.artistLocked) delete newState.artist;
    if (this.state.albumLocked) {
      delete newState.album;
      delete newState.albumArtist;
    }

    if (this.state.useCustomDate) {
      newState.timestamp = addSeconds(this.state.timestamp, DEFAULT_SONG_DURATION);

      // if time goes into the future disable custom timestamp
      // ToDo: make this a setting, maybe?
      /* if (isFuture(newState.timestamp)) {
        newState.timestamp = new Date();
        newState.useCustomDate = false;
      } */
    }

    if (this.state.undo) {
      this.props.dismissAlert({
        category: 'paste',
      });
    }

    this.setState(newState);

    document.getElementById(this.state.artistLocked ? 'title' : 'artist').focus();
  }

  swapArtistTitle() {
    this.setState({
      artist: this.state.title,
      title: this.state.artist,
    });
    ReactGA.event({
      category: 'Interactions',
      action: 'Swap',
    });
  }

  toggleLock(field) {
    const fieldName = `${field}Locked`;
    return () => {
      this.setState({
        [fieldName]: !this.state[fieldName],
      });
      ReactGA.event({
        category: 'Interactions',
        action: 'Lock',
        label: field,
      });
    };
  }

  toggleTimestampMode() {
    if (!this.state.useCustomDate) {
      ReactGA.event({
        category: 'Interactions',
        action: 'Use custom timestamp',
        label: 'Song',
      });
    }

    this.setState({
      useCustomDate: !this.state.useCustomDate,
      timestamp: new Date(),
    });
  }

  updateField(fieldname) {
    return (event) => {
      const state = {};
      state[fieldname] = event.target.value;
      this.setState(state, this.validateForm);
    };
  }

  validateForm() {
    let formIsValid = false;

    if (this.state.artist.trim().length > 0 && this.state.title.trim().length > 0) {
      formIsValid = true;
    }

    this.setState({
      canScrobble: formIsValid,
    });
  }

  render() {
    const t = this.props.t;
    const donationCTA = this.props.settings.isDonor ? null : (
      <div className="donation-cta mt-2">
        <a href="https://www.patreon.com/OpenScrobbler" rel="noopener">
          {t('considerDonating')}
        </a>
        <FontAwesomeIcon icon={faPatreon} />
      </div>
    );

    return (
      <Form className="SongForm">
        <FormGroup className="row">
          <Label for="artist" className="col-sm-3 required">
            {t('artist')}
          </Label>
          <div className="col-10 col-sm-8 p-0">
            <Input
              bsSize="sm"
              type="text"
              name="artist"
              id="artist"
              tabIndex="1"
              className="hasLock"
              value={this.state.artist}
              onChange={function() {}}
              onInput={this.updateField('artist')}
              onKeyUp={this.catchKeys}
              onPaste={this.catchPaste}
              data-lpignore="true"
            />
            <div className="lock-button rounded" id="lock-artist" onClick={this.toggleLock('artist')}>
              <FontAwesomeIcon className={this.state.artistLocked ? 'active' : ''} icon={faThumbtack} />
            </div>
            <Tooltip target="lock-artist">{t('lockArtist')}</Tooltip>
          </div>
          <div className="col-1 swaptool-top">
            <span>⏋</span>
            <Button onClick={this.swapArtistTitle} id="btn-swap" size="sm">
              <FontAwesomeIcon rotation={90} icon={faExchangeAlt} />
            </Button>
          </div>
          <Tooltip placement="left" target="btn-swap">
            {t('swapArtistTitle')}
          </Tooltip>
        </FormGroup>
        <FormGroup className="row">
          <Label for="title" className="col-sm-3 required">
            {t('title')}
          </Label>
          <Input
            bsSize="sm"
            className="col-10 col-sm-8"
            type="text"
            name="title"
            id="title"
            tabIndex="2"
            value={this.state.title}
            onChange={function() {}}
            onInput={this.updateField('title')}
            onKeyUp={this.catchKeys}
            onPaste={this.catchPaste}
            data-lpignore="true"
          />
          <div className="col-1 swaptool-bottom">
            <span>⏌</span>
          </div>
        </FormGroup>
        <FormGroup className="row">
          <Label for="album" className="col-sm-3">
            {t('album')}
          </Label>
          <div className="col-sm-9 p-0">
            <Input
              bsSize="sm"
              type="text"
              name="album"
              id="album"
              tabIndex="3"
              className="hasLock"
              value={this.state.album}
              onChange={function() {}}
              onInput={this.updateField('album')}
              onKeyUp={this.catchKeys}
              data-lpignore="true"
            />
            <div className="lock-button rounded" id="lock-album" onClick={this.toggleLock('album')}>
              <FontAwesomeIcon className={this.state.albumLocked ? 'active' : ''} icon={faThumbtack} />
            </div>
            <Tooltip target="lock-album">{t('lockAlbum')}</Tooltip>
          </div>
        </FormGroup>
        <FormGroup className="row">
          <Label for="album" className="col-sm-3">
            {t('albumArtist')}
          </Label>
          <div className="col-sm-9 p-0">
            <Input
              bsSize="sm"
              type="text"
              name="albumArtist"
              id="albumArtist"
              tabIndex="3"
              className="hasLock"
              value={this.state.albumArtist}
              onChange={function() {}}
              onInput={this.updateField('albumArtist')}
              onKeyUp={this.catchKeys}
              data-lpignore="true"
            />
          </div>
        </FormGroup>
        <FormGroup className="row">
          <Label className="col-sm-3">{t('timestamp')}</Label>
          <div className="col-sm-9 p-0">
            <ButtonGroup className="w-100">
              <Button
                onClick={() => this.toggleTimestampMode()}
                active={!this.state.useCustomDate}
                size="sm"
                className="w-50"
              >
                {t('now')}
              </Button>
              <Button
                onClick={() => this.toggleTimestampMode()}
                active={this.state.useCustomDate}
                size="sm"
                className="w-50"
              >
                {t('custom')}
              </Button>
            </ButtonGroup>
            <DateTimePicker
              value={this.state.timestamp}
              onChange={this.handleTimeChange}
              visible={this.state.useCustomDate}
            />
            <div className="row">
              <div className="col-12 mt-1">
                <FontAwesomeIcon icon={faLightbulb} /> {t('lastfmWillRejectOldTimestamps')}
              </div>
            </div>
          </div>
        </FormGroup>

        <Button
          className="scrobble-button mt-2"
          tabIndex="4"
          color="success"
          onClick={this.scrobbleSong}
          disabled={!this.state.canScrobble}
        >
          {t('scrobble')}!
        </Button>

        {donationCTA}
      </Form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createAlert: createAlert(dispatch),
    dismissAlert: dismissAlert(dispatch),
    enqueueScrobble: enqueueScrobble(dispatch),
  };
};

SongForm.propTypes = {
  createAlert: PropTypes.func,
  dismissAlert: PropTypes.func,
  enqueueScrobble: PropTypes.func,
  exportCloneReceiver: PropTypes.func,
  settings: PropTypes.shape({
    catchPaste: PropTypes.bool,
    isDonor: PropTypes.bool,
    use12Hours: PropTypes.bool,
  }),
  t: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SongForm));
