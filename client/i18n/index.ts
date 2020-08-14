import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import chain from "i18next-chained-backend";
import http from "i18next-http-backend";

// Load selected language from localStorage
var cachedLang: string | null = "en";
/* window ? window.localStorage.getItem("i18n-language") : null; */

i18n
  .use(chain)
  .use(initReactI18next)
  .init({
    backend: {
      backends: [http],
      backendOptions: [
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json" // xhr load path for my own fallback
        }
      ]
    },
    lng: cachedLang ? cachedLang : "en",
    fallbackLng: "en",
    fallbackNS: "en",
    load: "currentOnly"
  });

export function changeLanguage(lang: string) {
  // Save language preference to localStorage and change the language
  window.localStorage.setItem("i18n-language", lang);
  cachedLang = lang;
  i18n.changeLanguage(lang);
}

export default i18n;
