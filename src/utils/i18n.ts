import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { tweak } from './tweaks/Tweaks';

export const languageList = [
  { code: 'ast', name: 'Asturianu' }, // Asturian
  { code: 'ar', name: 'العربية', rtl: true }, // Arabic
  { code: 'bg', name: 'Български' }, // Bulgarian
  { code: 'ca', name: 'Català' }, // Catalan
  // { code: 'zh-Hans', name: '中文' }, // Chinese (simplified)
  { code: 'da', name: 'Dansk' }, // Danish
  { code: 'de', name: 'Deutsch' }, // German
  { code: 'el', name: 'Ελληνικά' }, // Greek
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }, // Spanish
  { code: 'fr', name: 'Français' }, // French
  { code: 'hr', name: 'Hrvatski' }, // Croatian
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' }, // Dutch
  { code: 'pl', name: 'Polski' }, // Polish
  { code: 'pt', name: 'Português' },
  { code: 'pt-BR', name: 'Português (BR)' },
  { code: 'sr', name: 'Српски' }, // Serbian
  { code: 'sv', name: 'Svenska' }, // Swedish
  { code: 'ru', name: 'Русский' }, // Russian
  { code: 'tr', name: 'Türkçe' }, // Turkish
  { code: 'uk', name: 'Українська' }, // Ukrainian
];

export const fallbackLng = {
  'ar-jo': ['ar'],
  'ast-ES': ['ast'],
  'bg-BG': ['bg'],
  'ca-ES': ['ca'],
  'ca-AD': ['ca'],
  'el-GR': ['el'],
  'el-CY': ['el'],
  'en-US': ['en'],
  'en-UK': ['en'],
  'es-AR': ['es'],
  'es-ES': ['es'],
  'hr-HR': ['hr'],
  'it-CH': ['it'],
  'pt-BR': ['pt-BR'],
  'pt-PT': ['pt'],
  'fr-FR': ['fr'],
  'uk-UA': ['uk'],
  'sv-SE': ['sv'],
  default: ['en'],
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: 'languageOnly',
    fallbackLng,
    backend: {
      loadPath: `/locales/{{lng}}.json?v=${process.env.REACT_APP_VERSION}`,
      allowMultiLoading: false,
    },
    debug: tweak(false, 'i18n', 'Debug'),
    interpolation: {
      escapeValue: false, // not needed for react
    },
    react: {
      useSuspense: true,
    },
  });

i18n.on('languageChanged', (newLang) => {
  document.documentElement.lang = newLang;
  const isRTL = languageList.find(({ code }) => code === newLang)?.rtl;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
});

export default i18n;
