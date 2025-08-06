import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getTextDirection } from '../i18n.ts';

interface LocaleContextType {
  currentLocale: string;
  changeLocale: (locale: string) => void;
  textDirection: string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLocale, setCurrentLocale] = useState(i18n.language);
  const [textDirection, setTextDirection] = useState(getTextDirection());

  const changeLocale = (locale: string) => {
    i18n.changeLanguage(locale);
    setCurrentLocale(locale);
    setTextDirection(getTextDirection());
    
    // Update document direction
    document.documentElement.dir = getTextDirection();
    document.documentElement.lang = locale;
  };

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLocale(lng);
      setTextDirection(getTextDirection());
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const value: LocaleContextType = {
    currentLocale,
    changeLocale,
    textDirection,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};