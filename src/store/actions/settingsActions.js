import axios from 'axios';
import { createAlert } from './alertActions';
import i18n, { fallbackLng } from 'i18n';
import LanguageDetector from 'i18next-browser-languagedetector';

import {
  OPENSCROBBLER_API_URL,
  SETTINGS_UPDATE,
  SETTINGS_SAVE,
  DEBOUNCE_PERIOD,
} from 'Constants';

export function setSettings(dispatch) {
  return (newSettings, pushToServer=true, silent=false) => {
    if (pushToServer) {
      dispatch({
        type: SETTINGS_SAVE,
        meta: {
          debounce: {time: silent ? DEBOUNCE_PERIOD : 1},
        },
        payload: () => {
          axios.post(`${OPENSCROBBLER_API_URL}/settings.php`, newSettings)
            .then(() => {
              if (!silent) {
                createAlert(dispatch)({
                  type: 'success',
                  category: 'settings',
                  message: 'settingsSavedSuccessfully'
                });
              }
            })
        },
      });
    }

    if (newSettings.lang) {
      let newLang = newSettings.lang;
      if (newSettings.lang === 'auto') {
        newLang = new LanguageDetector().detectors.navigator.lookup()[0] || fallbackLng.default[0];
        if (newLang.length > 2 && fallbackLng.hasOwnProperty(newLang)) {
          newLang = fallbackLng[newLang][0];
        }
      }
      i18n.changeLanguage(newLang);
    }

    dispatch({
      type: SETTINGS_UPDATE,
      payload: newSettings
    });
  };
}
