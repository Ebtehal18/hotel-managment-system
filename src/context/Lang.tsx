import { createContext, useState, useContext, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Define the shape of the context value
interface LanguageContextType {
  language: string;
  changeLanguage: (newLang: string) => void;
}

// Create context with proper type (or undefined initially)
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component with typed props
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState('en'); // default language
    const { i18n } = useTranslation();
  const changeLanguage = (newLang: string) => {
    setLanguage(newLang);
    // If using react-i18next:
    i18n.changeLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Optional: Custom hook for safer context usage
export const UseLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};