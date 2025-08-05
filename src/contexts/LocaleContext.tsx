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

/**
 * Get user's locale configuration from localStorage or browser defaults
 */
function getLocaleConfigLocal(): LocaleConfig {
  try {
    const stored = localStorage.getItem('valvechain-locale-config');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        locale: parsed.locale || DEFAULT_CONFIG.locale,
        timezone: parsed.timezone || DEFAULT_CONFIG.timezone,
        currency: parsed.currency || DEFAULT_CONFIG.currency,
      };
    }
  } catch (error) {
    console.warn('Failed to load locale configuration:', error);
  }

  // Try to detect from browser
  const browserLocale = navigator.language || 'en-US';
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return {
    locale: browserLocale,
    timezone: browserTimezone,
    currency: DEFAULT_CONFIG.currency,
  };
}

/**
 * Save locale configuration to localStorage
 */
function setLocaleConfigLocal(config: Partial<LocaleConfig>): void {
  try {
    const currentConfig = getLocaleConfigLocal();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('valvechain-locale-config', JSON.stringify(newConfig));
  } catch (error) {
    console.warn('Failed to save locale configuration:', error);
  }
}

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