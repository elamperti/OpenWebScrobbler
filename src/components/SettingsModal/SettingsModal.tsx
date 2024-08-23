import { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-regular-svg-icons';

import { languageList } from 'utils/i18n';

import { Trans, useTranslation } from 'react-i18next';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { createAlert } from 'store/actions/alertActions';
import { useUserData } from 'hooks/useUserData';
import { useSettings } from 'hooks/useSettings';

import { SettingsModalContext } from './SettingsModalContext';
import ConnectPatreon from './partials/ConnectPatreon';

export default function SettingsModal() {
  const { user } = useUserData();
  const { settings: currentSettings, updateSettings } = useSettings();
  const { isOpen, setSettingsModalVisible } = useContext(SettingsModalContext);
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [language, setLanguage] = useState(currentLanguage);
  const [use12Hours, setUse12Hours] = useState(false);
  const [catchPaste, setCatchPaste] = useState(false);
  const trackNumbersEnabled = false; // useFeatureIsOn('show-track-numbers');
  const connectPatreonFF = useFeatureIsOn('connect-patreon');
  const [showTrackNumbers, setShowTrackNumbers] = useState(false);

  useEffect(() => {
    if (currentSettings) {
      setLanguage(currentSettings.lang);
      setUse12Hours(currentSettings.use12Hours);
      setCatchPaste(currentSettings.catchPaste);
      setShowTrackNumbers(currentSettings.showTrackNumbers);
    }
  }, [currentSettings]);

  const close = () => setSettingsModalVisible(false);

  const saveAndClose = () => {
    setIsSaving(true);
    updateSettings(
      {
        lang: language,
        use12Hours,
        catchPaste,
        showTrackNumbers,
      },
      {
        onSuccess: () => {
          setIsSaving(false);
          setSettingsModalVisible(false);
          dispatch(
            createAlert({
              type: 'success',
              category: 'settings',
              message: 'settingsSavedSuccessfully',
            })
          );
        },
        onError: () => {
          setIsSaving(false);
          dispatch(
            createAlert({
              type: 'warning',
              category: 'settings',
              rawMessage: 'Error saving settings',
            })
          );
        },
      }
    );
  };

  if (!user) return null;

  return (
    <Modal id="SettingsModal" isOpen={isOpen} toggle={close} data-cy="SettingsModal">
      <ModalHeader toggle={close}>
        <FontAwesomeIcon className="me-2" icon={faCog} />
        <Trans i18nKey="settingsFor">Settings for</Trans> {user.name}
      </ModalHeader>
      <ModalBody>
        <Form>
          <h3 className="h5 border-bottom border-secondary mb-3">
            <Trans i18nKey="general">General</Trans>
          </h3>
          <FormGroup>
            <div className="row ms-0 ms-sm-auto me-0">
              <Label className="col-sm-4" htmlFor="lang">
                <Trans i18nKey="language">Language</Trans>
              </Label>
              <div className="col-sm-8">
                <Input
                  type="select"
                  bsSize="sm"
                  name="lang"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  data-cy="SettingsModal-language"
                >
                  <option value="auto">
                    (<Trans i18nKey="defaultLanguage">default</Trans>)
                  </option>
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
                  <Trans i18nKey="translateYourLanguage">Translate your language</Trans>
                </a>
              </div>
            </div>
          </FormGroup>

          <FormGroup check>
            <Label className="d-block" check>
              <Input
                type="checkbox"
                name="use12Hours"
                checked={use12Hours}
                onChange={() => setUse12Hours(!use12Hours)}
              />
              <Trans i18nKey="use12HoursFormat">Use 12-hour format</Trans>
            </Label>
            <Label className="d-block" check>
              <Input
                type="checkbox"
                name="catchPaste"
                checked={catchPaste}
                onChange={() => setCatchPaste(!catchPaste)}
              />
              <Trans i18nKey="splitPastedText">Split pasted text</Trans>
            </Label>
            {trackNumbersEnabled && (
              <Label className="d-block" check>
                <Input
                  type="checkbox"
                  name="showTrackNumbers"
                  checked={showTrackNumbers}
                  onChange={() => setShowTrackNumbers(!showTrackNumbers)}
                />
                <Trans i18nKey="showTrackNumbers">Show track numbers</Trans>
              </Label>
            )}
          </FormGroup>

          {connectPatreonFF && (
            <div className="mt-3">
              <h3 className="h5 border-bottom border-secondary mb-3">
                <Trans i18nKey="applications">Applications</Trans>
              </h3>
              <ConnectPatreon />
            </div>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          className="btn-cancel"
          color="secondary"
          onClick={close}
          disabled={isSaving}
          data-cy="SettingsModal-cancel"
        >
          <Trans i18nKey="cancel">Cancel</Trans>
        </Button>
        <Button
          className="btn-save"
          color="success"
          onClick={saveAndClose}
          disabled={isSaving}
          data-cy="SettingsModal-save"
        >
          {isSaving && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
          {!isSaving && <FontAwesomeIcon className="me-2" icon={faSave} />}
          <Trans i18nKey="saveSettings">Save</Trans>
        </Button>
      </ModalFooter>
    </Modal>
  );
}
