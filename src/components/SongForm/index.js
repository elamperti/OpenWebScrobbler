import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ReactGA from 'react-ga';

import addDays from 'date-fns/add_days';
import addMinutes from 'date-fns/add_minutes';
// import isFuture from 'date-fns/is_future';
import subDays from 'date-fns/sub_days';
import format from 'date-fns/format';

import {
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
} from 'reactstrap';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import TimePicker from 'components/TimePicker';
import Tooltip from 'components/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbtack,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCalendarAlt,
  faLightbulb,
  faClock,
} from '@fortawesome/free-regular-svg-icons';
import {
  faPatreon,
} from '@fortawesome/free-brands-svg-icons';

import { enqueueScrobble } from 'store/actions/scrobbleActions';
import { createAlert, dismissAlert } from 'store/actions/alertActions';

import './SongForm.css';

const controlOrder = ['artist', 'title', 'album']; // Used for arrow navigation

class InputForDatePicker extends React.Component {
  render() {
    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </span>
        </InputGroupAddon>
        <Input bsSize="sm" {...this.props} />
      </InputGroup>
    );
  }
}

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
    }

    this.catchKeys = this.catchKeys.bind(this);
    this.catchPaste = this.catchPaste.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.revertPaste = this.revertPaste.bind(this);
    this.scrobbleSong = this.scrobbleSong.bind(this);
    this.swapArtistTitle = this.swapArtistTitle.bind(this);
    this.toggleLock = this.toggleLock.bind(this);
    this.toggleTimestampMode = this.toggleTimestampMode.bind(this);
    this.validateForm = this.validateForm.bind(this);
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
    switch(event.keyCode) {
      case 38: // Up arrow
        {
          let prevControl = controlOrder[(controlOrder.indexOf(event.target.id) + 2) % 3];
          document.getElementById(prevControl).focus();
        }
        break;
      case 40: // Down arrow
        {
          let nextControl = controlOrder[(controlOrder.indexOf(event.target.id) + 1) % 3];
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

    let splittedValues = /(.+) [-—] (.+)/.exec(event.clipboardData.getData('Text').trim());
    let prevState;
    let pasteData;

    if (splittedValues) {
      // Assigns values depending on which field they were pasted on
      switch(event.target.id) {
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

      this.setState({
        ...pasteData,
        undo: prevState,
      }, () => {
        this.props.createAlert({
          type: 'info',
          category: 'paste',
          rawMessage: (
            <div>
              {this.props.t('pasteIntercepted')} ✨
              <span
                href="#"
                onClick={this.revertPaste}
                className="ml-2 alert-link"
              >
                {this.props.t('undo')}
              </span>
            </div>
          ),
        });
        this.validateForm();
      });
      event.preventDefault(); // avoids the call to onChange handler
    }
  }

  handleDateChange(newDate) {
    if (!this.state.useCustomDate) return;
    newDate.setHours(this.state.timestamp.getHours());
    newDate.setMinutes(this.state.timestamp.getMinutes());

    this.setState({
      timestamp: newDate,
    });
  }

  handleTimeChange(newDate) {
    if (!this.state.useCustomDate) return;
    this.setState({
      timestamp: newDate,
    });
  }

  revertPaste() {
    this.setState({
      ...this.state.undo,
      undo: null,
    }, () => {
      this.validateForm();
    });
    this.props.dismissAlert({
      category: 'paste',
    });
  };

  scrobbleSong() {
    let newState = {
      canScrobble: false,
      artist: '',
      title: '',
      album: '',
      albumArtist: '',
      undo: null,
    };

    this.props.enqueueScrobble([{
      artist: this.state.artist,
      title: this.state.title,
      album: this.state.album,
      albumArtist: this.state.albumArtist,
      timestamp: this.state.useCustomDate ? this.state.timestamp : new Date(),
    }]);

    if (this.state.artistLocked) delete newState.artist;
    if (this.state.albumLocked) {
      delete newState.album;
      delete newState.albumArtist;
    };

    if (this.state.useCustomDate) {
      newState.timestamp = addMinutes(this.state.timestamp, 3);

      // if time goes into the future disable custom timestamp
      // ToDo: make this a setting, maybe?
      /*if (isFuture(newState.timestamp)) {
        newState.timestamp = new Date();
        newState.useCustomDate = false;
      }*/
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
      action: 'Swap'
    });
  }

  toggleLock(field) {
    const fieldName = `${field}Locked`;
    return () => {
      this.setState({
        [fieldName]: !this.state[fieldName]
      });
      ReactGA.event({
        category: 'Interactions',
        action: 'Lock',
        label: field
      });
    }
  }

  toggleTimestampMode() {
    this.setState({
      useCustomDate: !this.state.useCustomDate,
      timestamp: new Date(),
    });
  }

  updateField(fieldname) {
    return (event) => {
      let state = {};
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
    })
  }

  render() {
    const t = this.props.t; // Translations
    const minDate = subDays(new Date(), 14);
    const maxDate = addDays(new Date(), 14);

    const donationCTA = this.props.settings.isDonor ? null : (
      <div className="donation-cta mt-2">
        <a href="https://www.patreon.com/OpenScrobbler" rel="noopener">{t('considerDonating')}</a>
        <FontAwesomeIcon icon={faPatreon} />
      </div>
    );

    return (
      <Form className="SongForm">
        <FormGroup className="row">
          <Label for="artist" className="col-sm-3 required">{t('artist')}</Label>
          <div className="col-10 col-sm-8 p-0">
            <Input
              bsSize="sm"
              type="text"
              name="artist"
              id="artist"
              tabIndex="1"
              className="hasLock"
              value={this.state.artist}
              onInput={this.updateField('artist')}
              onKeyUp={this.catchKeys}
              onPaste={this.catchPaste}
              data-lpignore="true"
            />
            <div className="lock-button rounded" id="lock-artist" onClick={this.toggleLock('artist')}>
              <FontAwesomeIcon
                className={this.state.artistLocked ? 'active' : ''}
                icon={faThumbtack}
              />
            </div>
            <Tooltip target="lock-artist">
              {t('lockArtist')}
            </Tooltip>
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
          <Label for="title" className="col-sm-3 required">{t('title')}</Label>
          <Input
            bsSize="sm"
            className="col-10 col-sm-8"
            type="text"
            name="title"
            id="title"
            tabIndex="2"
            value={this.state.title}
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
          <Label for="album" className="col-sm-3">{t('album')}</Label>
          <div className="col-sm-9 p-0">
            <Input
              bsSize="sm"
              type="text"
              name="album"
              id="album"
              tabIndex="3"
              className="hasLock"
              value={this.state.album}
              onInput={this.updateField('album')}
              onKeyUp={this.catchKeys}
              data-lpignore="true"
            />
            <div className="lock-button rounded" id="lock-album" onClick={this.toggleLock('album')}>
              <FontAwesomeIcon
                className={this.state.albumLocked ? 'active' : ''}
                icon={faThumbtack}
              />
            </div>
            <Tooltip target="lock-album">
              {t('lockAlbum')}
            </Tooltip>
          </div>
        </FormGroup>
        <FormGroup className="row">
          <Label for="album" className="col-sm-3">{t('albumArtist')}</Label>
          <div className="col-sm-9 p-0">
            <Input
              bsSize="sm"
              type="text"
              name="albumArtist"
              id="albumArtist"
              tabIndex="3"
              className="hasLock"
              value={this.state.albumArtist}
              onInput={this.updateField('albumArtist')}
              onKeyUp={this.catchKeys}
              data-lpignore="true"
            />
          </div>
        </FormGroup>
        <FormGroup className="row">
          <Label className="col-sm-3">
            {t('timestamp')}
          </Label>
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
            <div className={'timestamp row' + (this.state.useCustomDate ? '' : ' d-none')}>
              <div className="col-sm-6 mt-3">
                <DayPickerInput
                  dayPickerProps={{
                    fromMonth: minDate,
                    toMonth: maxDate,
                    disabledDays: {
                      before: minDate,
                      after: maxDate,
                    }
                  }}
                  format={t('dates.format.short')}
                  formatDate={format}
                  component={InputForDatePicker}
                  onDayChange={this.handleDateChange}
                  value={this.state.timestamp}
                  inputProps={{readOnly: true}}
                />
              </div>
              <div className="col-sm-6 mt-3">
                <TimePicker
                  use12Hours={this.props.settings.use12Hours}
                  icon={(
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faClock} />
                    </span>
                  )}
                  onChange={this.handleTimeChange}
                  value={this.state.timestamp}
                  format={this.props.settings.use12Hours ? 'hh:mm a' : 'HH:mm'}
                />
              </div>
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
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    enqueueScrobble: enqueueScrobble(dispatch),
    createAlert: createAlert(dispatch),
    dismissAlert: dismissAlert(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  translate(['common'])(SongForm)
);
