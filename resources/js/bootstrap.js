import axios from 'axios';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// translation
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        load: 'languageOnly', // load only the current language, not regional variants
    });

// Set the initial Accept-Language header
window.axios.defaults.headers.common['Accept-Language'] = i18n.language;
// Update the Accept-Language header whenever the language is changed
i18n.on('languageChanged', function(lang) {
    window.axios.defaults.headers.common['Accept-Language'] = lang;
});
