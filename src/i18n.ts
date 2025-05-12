import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import glTranslations from "./assets/locales/gl/translation.json";
import enTranslations from "./assets/locales/en/translation.json";

const resources = {
  en: { translation: enTranslations },
  gl: { translation: glTranslations }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "gl",
    fallbackLng: 'gl',
    interpolation: {
      escapeValue: false
    }
  })
  .catch((err) => {
    console.error('i18n initialization failed', err);
  });

export default i18n;
