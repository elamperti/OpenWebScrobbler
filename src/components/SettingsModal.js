import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { PropTypes } from 'prop-types';

import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import {
  faSave,
} from '@fortawesome/free-regular-svg-icons';

import { dismissAlert } from 'store/actions/alertActions';
import { setSettings } from 'store/actions/settingsActions';
import { languageList } from 'i18n';

// import './SettingsModal.css';

class SettingsModal extends React.Component {
  constructor(props) {
    super(props);

    this.createPropsForCheckbox = this.createPropsForCheckbox.bind(this);
    this.getLatestSettings = this.getLatestSettings.bind(this);
    this.saveSettings = this.saveSettings.bind(this);

    this.state = {
      settings: {
        ...this.props.settings,
      },
    };
  }

  createPropsForCheckbox(name) {
    return {
      name,
      checked: this.state.settings[name],
      onChange: (event) => {
        this.setState({
          settings: {
            ...this.state.settings,
            [name]: !this.state.settings[name]
          }
        })
      },
    };
  }

  createPropsForInput(name) {
    return {
      name,
      value: this.state.settings[name],
      onChange: (event) => {
        this.setState({
          settings: {
            ...this.state.settings,
            [name]: event.target.value,
          }
        })
      },
    };
  }

  getLatestSettings() {
    this.setState({
      settings: {
        ...this.props.settings
      },
    });
  }

  saveSettings() {
    this.props.setSettings(this.state.settings);
    this.props.toggle();
  }

  render() {
    const t = this.props.t; // Translations

    let languageOptions = [];
    for (let lang of languageList) {
      languageOptions.push(
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      );
    }

    return (
      <Modal
        id="SettingsModal"
        onOpened={this.getLatestSettings}
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
      >
        <ModalHeader toggle={this.props.toggle}>
          <FontAwesomeIcon className="mr-2" icon={faCog} />
          {t('settingsFor')} {this.props.user.name}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <div className="row ml-0 ml-sm-auto mr-0">
                <Label className="col-sm-4" htmlFor="lang">{t('language')}</Label>
                <div className="col-sm-8">
                  <Input type="select" bsSize="sm" {...this.createPropsForInput('lang')}>
                    <option value="auto">({t('defaultLanguage')})</option>
                    <optgroup label={t('availableLanguages')}>
                      {languageOptions}
                    </optgroup>
                  </Input>
                  <a className="d-none d-sm-block text-right translationCTA"
                     target="_blank" rel="noopener noreferrer"
                     href="https://github.com/elamperti/OpenWebScrobbler/#translations"
                  >
                    {t('translateYourLanguage')}
                  </a>
                </div>
              </div>
            </FormGroup>
            <FormGroup check>
              <Label className="d-block" check>
                <Input type="checkbox" {...this.createPropsForCheckbox('use12Hours')} />
                {t('use12HoursFormat')}
              </Label>
              <Label className="d-block" check>
                <Input type="checkbox" {...this.createPropsForCheckbox('catchPaste')} />
                {t('splitPastedText')}
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="btn-cancel" color="secondary" onClick={this.props.toggle}>
            {t('cancel')}
          </Button>
          <Button className="btn-save" color="success" onClick={this.saveSettings}>
            <FontAwesomeIcon className="mr-2" icon={faSave} />
            {t('saveSettings')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    settings: state.settings,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dismissAlert: dismissAlert(dispatch),
    setSettings: setSettings(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  translate(['settings'])(SettingsModal)
);
