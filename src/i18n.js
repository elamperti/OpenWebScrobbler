import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

export const languageList = [
  {code: 'ca', name: 'Català'},
  {code: 'de', name: 'Deutsch'},
  {code: 'en', name: 'English'},
  {code: 'es', name: 'Español'},
  {code: 'nl', name: 'Nederlands'},
  {code: 'pl', name: 'polski'},
  {code: 'pt', name: 'Português'},
  {code: 'ru', name: 'Русский'}
];

export const fallbackLng = {
  'ca-ES': ['ca'],
  'ca-AD': ['ca'],
  'en-US': ['en'],
  'en-UK': ['en'],
  'es-AR': ['es'],
  'es-ES': ['es'],
  'pt-BR': ['pt'],
  'pt-PT': ['pt'],
  'default': ['en']
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    load: 'languageOnly', // 'en-US' becomes 'en'
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      allowMultiLoading: false
    },
    fallbackLng,

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    fallbackNS: 'common',

    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // not needed for react
    },

    react: {
      wait: true
    }
  })
  .on('languageChanged', (newLang) => {
    document.documentElement.lang = newLang;
  });

export default i18n;
