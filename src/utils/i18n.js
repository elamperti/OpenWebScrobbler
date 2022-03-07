import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const languageList = [
  { code: 'ca', name: 'Català' },
  { code: 'da', name: 'Dansk' },
  { code: 'de', name: 'Deutsch' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'polski' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Українська' },
];

export const fallbackLng = {
  'ca-ES': ['ca'],
  'ca-AD': ['ca'],
  'el-GR': ['el'],
  'el-CY': ['el'],
  'en-US': ['en'],
  'en-UK': ['en'],
  'es-AR': ['es'],
  'es-ES': ['es'],
  'it-CH': ['it'],
  'pt-BR': ['pt'],
  'pt-PT': ['pt'],
  'fr-FR': ['fr'],
  'uk-UA': ['uk'],
  default: ['en'],
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: 'all', // e.g. 'en-US' tries 'en-US' -> 'en' -> [fallbackLng]
    backend: {
      loadPath: '/locales/{{lng}}.json',
      allowMultiLoading: false,
    },
    fallbackLng,

    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // not needed for react
    },

    react: {
      useSuspense: true,
      wait: true,
    },
  });

i18n.on('languageChanged', (newLang) => {
  document.documentElement.lang = newLang;
});

export default i18n;
