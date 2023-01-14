import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { Button, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-regular-svg-icons';

import { setSettings, closeSettingsModal } from 'store/actions/settingsActions';
import { languageList } from 'utils/i18n';
import { PROVIDER_LASTFM, PROVIDER_DISCOGS } from 'Constants';

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
      onChange: (/* event */) => {
        this.setState({
          settings: {
            ...this.state.settings,
            [name]: !this.state.settings[name],
          },
        });
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
          },
        });
      },
    };
  }

  getLatestSettings() {
    this.setState({
      settings: {
        ...this.props.settings,
      },
    });
  }

  saveSettings() {
    this.props.setSettings(this.state.settings);
    this.props.close();
  }

  render() {
    const t = this.props.t;

    return (
      <Modal
        id="SettingsModal"
        onOpened={this.getLatestSettings}
        isOpen={this.props.settings.modalIsOpen}
        toggle={this.props.close}
      >
        <ModalHeader toggle={this.props.close}>
          <FontAwesomeIcon className="me-2" icon={faCog} />
          {t('settingsFor')} {this.props.user.name}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <div className="row ms-0 ms-sm-auto me-0">
                <Label className="col-sm-4" htmlFor="lang">
                  {t('language')}
                </Label>
                <div className="col-sm-8">
                  <Input type="select" bsSize="sm" {...this.createPropsForInput('lang')}>
                    <option value="auto">({t('defaultLanguage')})</option>
                    <optgroup label={t('availableLanguages')}>
                      {languageList.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </optgroup>
                  </Input>
                  <a
                    className="d-none d-sm-block text-end translationCTA"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={process.env.REACT_APP_LINK_TO_TRANSLATIONS}
                  >
                    {t('translateYourLanguage')}
                  </a>
                </div>
              </div>
            </FormGroup>

            <FormGroup>
              <div className="row ms-0 ms-sm-auto me-0">
                <Label className="col-sm-4" htmlFor="lang">
                  {t('dataProvider')}
                </Label>
                <div className="col-sm-8">
                  <Input type="select" bsSize="sm" {...this.createPropsForInput('dataProvider')}>
                    <option value={PROVIDER_LASTFM}>Last.fm</option>
                    <option value={PROVIDER_DISCOGS}>Discogs</option>
                  </Input>
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
          <Button className="btn-cancel" color="secondary" onClick={this.props.close}>
            {t('cancel')}
          </Button>
          <Button className="btn-save" color="success" onClick={this.saveSettings}>
            <FontAwesomeIcon className="me-2" icon={faSave} />
            {t('saveSettings')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    settings: state.settings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSettings: setSettings(dispatch),
    close: closeSettingsModal(dispatch),
  };
};

SettingsModal.propTypes = {
  setSettings: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  t: PropTypes.func,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SettingsModal));
