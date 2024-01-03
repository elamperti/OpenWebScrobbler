import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { fallbackLng } from 'utils/i18n';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setLanguage] = useState(i18n.language);

  useEffect(() => {
    if (currentLanguage) {
      if (currentLanguage === 'auto') {
        let detectedLanguage = new LanguageDetector().detectors.navigator.lookup()[0] || fallbackLng.default[0];
        if (detectedLanguage.length > 2 && Object.prototype.hasOwnProperty.call(fallbackLng, detectedLanguage)) {
          detectedLanguage = fallbackLng[detectedLanguage][0];
        }
        changeLanguage(detectedLanguage);
      } else {
        changeLanguage(currentLanguage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  return {
    currentLanguage,
    setLanguage,
  };
};
