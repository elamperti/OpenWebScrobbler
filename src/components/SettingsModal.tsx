import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-regular-svg-icons';

import { setSettings, closeSettingsModal } from 'store/actions/settingsActions';
import { languageList } from 'utils/i18n';
import { RootState } from 'store';
import { Trans, useTranslation } from 'react-i18next';

export function SettingsModal() {
  const user = useSelector((state: RootState) => state.user);
  const currentSettings = useSelector((state: RootState) => state.settings);

  const dispatch = useDispatch();
  const close = useCallback(() => dispatch(closeSettingsModal()), [dispatch]);
  const { t } = useTranslation();

  const trackNumbersEnabled = false; // useFeatureIsOn('show-track-numbers');

  const [language, setLanguage] = useState(currentSettings.lang);
  const [use12Hours, setUse12Hours] = useState(currentSettings.use12Hours);
  const [catchPaste, setCatchPaste] = useState(currentSettings.catchPaste);
  const [showTrackNumbers, setShowTrackNumbers] = useState(currentSettings.showTrackNumbers);

  const saveAndClose = () => {
    setSettings(dispatch)({
      lang: language,
      use12Hours,
      catchPaste,
      showTrackNumbers,
    });
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <Modal id="SettingsModal" isOpen={currentSettings.modalIsOpen} toggle={close}>
      <ModalHeader toggle={close}>
        <FontAwesomeIcon className="me-2" icon={faCog} />
        <Trans i18nKey="settingsFor">Settings for</Trans> {user.name}
      </ModalHeader>
      <ModalBody>
        <Form>
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
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="btn-cancel" color="secondary" onClick={close}>
          <Trans i18nKey="cancel">Cancel</Trans>
        </Button>
        <Button className="btn-save" color="success" onClick={saveAndClose}>
          <FontAwesomeIcon className="me-2" icon={faSave} />
          <Trans i18nKey="saveSettings">Save</Trans>
        </Button>
      </ModalFooter>
    </Modal>
  );
}
