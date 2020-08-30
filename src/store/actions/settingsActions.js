import axios from 'axios';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { fallbackLng } from 'utils/i18n';

import { createAlert } from 'store/actions/alertActions';

import {
  OPENSCROBBLER_API_URL,
  SETTINGS_UPDATE,
  SETTINGS_SAVE,
  DEBOUNCE_PERIOD,
  SETTINGS_MODAL_OPEN,
  SETTINGS_MODAL_CLOSE,
  SETTINGS_SET_DATA_PROVIDER,
} from 'Constants';

export function setSettings(dispatch) {
  return (newSettings, pushToServer = true, silent = false) => {
    if (pushToServer) {
      dispatch({
        type: SETTINGS_SAVE,
        meta: {
          debounce: { time: silent ? DEBOUNCE_PERIOD : 1 },
        },
        payload: () => {
          axios.post(`${OPENSCROBBLER_API_URL}/settings.php`, newSettings).then(() => {
            if (!silent) {
              createAlert(dispatch)({
                type: 'success',
                category: 'settings',
                message: 'settingsSavedSuccessfully',
              });
            }
          });
        },
      });
    }

    if (newSettings.lang) {
      let newLang = newSettings.lang;
      if (newSettings.lang === 'auto') {
        newLang = new LanguageDetector().detectors.navigator.lookup()[0] || fallbackLng.default[0];
        if (newLang.length > 2 && Object.prototype.hasOwnProperty.call(fallbackLng, newLang)) {
          newLang = fallbackLng[newLang][0];
        }
      }
      i18n.changeLanguage(newLang);
    }

    dispatch({
      type: SETTINGS_UPDATE,
      payload: newSettings,
    });
  };
}

export function openSettingsModal(dispatch) {
  return () => {
    dispatch({
      type: SETTINGS_MODAL_OPEN,
    });
  };
}

export function closeSettingsModal(dispatch) {
  return () => {
    dispatch({
      type: SETTINGS_MODAL_CLOSE,
    });
  };
}

export function setDataProvider(provider) {
  return {
    type: SETTINGS_SET_DATA_PROVIDER,
    payload: provider,
  };
}
