import React, { createContext, useContext, ReactNode } from 'react';

interface LocaleConfig {
  locale: string;
  timezone: string;
  currency: string;
}

interface LocaleContextType {
  config: LocaleConfig;
  updateLocale: (newConfig: Partial<LocaleConfig>) => void;
  isLoading: boolean;
}

const defaultConfig: LocaleConfig = {
  locale: navigator.language || 'en-US',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  currency: 'USD',
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const value: LocaleContextType = {
    config: defaultConfig,
    updateLocale: () => {}, // Placeholder for now
    isLoading: false,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};