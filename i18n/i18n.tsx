import { createContext, useContext, useMemo, useState } from 'react';
import * as en from './en/translation.json';
import * as es from './es/translation.json';
import * as he from './he/translation.json';
import * as zh from './zh/translation.json';

const translations = { en, es, he, zh } as any;

function getPath(obj: any, path: string) {
  return path.split('.').reduce((acc, item) => (acc && acc[item] ? acc[item] : null), obj);
}

interface UserLanguageContextInterface {
  userLanguage: string;
  setUserLanguage: () => void;
}

const UserLanguageContext = createContext<UserLanguageContextInterface>({
  userLanguage: '',
  setUserLanguage: () => {}
});

export function UserLanguageProvider({
  children,
  defaultUserLanguage
}: {
  children: any;
  defaultUserLanguage: string;
}) {
  const [userLanguage, setUserLanguage] = useState(defaultUserLanguage);
  const contextValue = useMemo(() => {
    return { userLanguage, setUserLanguage } as UserLanguageContextInterface;
  }, [userLanguage]);

  return (
    <UserLanguageContext.Provider value={contextValue}>{children}</UserLanguageContext.Provider>
  );
}

export function useUserLanguage() {
  return useContext(UserLanguageContext).userLanguage;
}

export function useSetUserLanguage() {
  return useContext(UserLanguageContext).setUserLanguage;
}

const warnedOnce: { [key: string]: boolean } = {};

export function useTranslate() {
  const userLanguage = useUserLanguage();

  return useMemo(
    () =>
      function translate(key: string, options: any = {}) {
        const { ignoreWarning = false } = options;
        const wordings = translations[userLanguage];

        if (!wordings) {
          console.error(`Missing language: ${userLanguage}.`);
          return '…';
        }

        const translation = getPath(wordings, key);

        if (!translation) {
          const fullKey = `${userLanguage}:${key}`;
          // No warnings in CI env
          if (!ignoreWarning && !warnedOnce[fullKey] && typeof window !== 'undefined') {
            console.error(`Missing translation for ${fullKey}`);
            warnedOnce[fullKey] = true;
          }
          return getPath(translations.en, key);
        }

        return translation;
      },
    [userLanguage]
  );
}
