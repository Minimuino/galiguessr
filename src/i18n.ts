/*
 * Copyright (c) 2025, Carlos Pérez Ramil
 *
 * This file is part of the GaliGuessr project and is licensed under the GNU GPL v3.0.
 * See LICENSE file in the root directory of this project or at <https://www.gnu.org/licenses/gpl-3.0>.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./assets/locales/en/translation.json";
import glTranslations from "./assets/locales/gl/translation.json";

const resources = {
  en: { translation: enTranslations },
  gl: { translation: glTranslations }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "gl",
    fallbackLng: "gl",
    interpolation: {
      escapeValue: false
    }
  })
  .catch((err) => {
    console.error("i18n initialization failed", err);
  });

export default i18n;
