import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LocaleConfig {
  locale: string;
  timezone: string;
  currency: string;
}

const DEFAULT_CONFIG: LocaleConfig = {
  locale: 'en-US',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  currency: 'USD',
};

interface LocaleContextType {
  config: LocaleConfig;
  updateLocale: (newConfig: Partial<LocaleConfig>) => void;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<LocaleConfig>(() => getLocaleConfigLocal());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize locale config
    const initialConfig = getLocaleConfigLocal();
    setConfig(initialConfig);
    setIsLoading(false);
  }, []);

  const updateLocale = (newConfig: Partial<LocaleConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    setLocaleConfigLocal(newConfig);
  };

  const value: LocaleContextType = {
    config,
    updateLocale,
    isLoading,
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