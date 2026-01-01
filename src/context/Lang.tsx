import { createContext, useState } from 'react';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // default language

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    // If using react-i18next, also call i18n.changeLanguage(newLang)
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};