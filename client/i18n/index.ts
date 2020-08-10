import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import backend from "i18next-xhr-backend";

i18n.use(backend).use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en"
});

export default i18n;
