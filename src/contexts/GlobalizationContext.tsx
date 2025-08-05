// Globalization Context for managing currency and unit preferences

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserPreferences, 
  SupportedCurrency, 
  ExchangeRates 
} from '../types/globalization';
import { localeService } from '../services/localeService.ts';
import { fxRateService } from '../services/fxRateService.ts';

interface GlobalizationContextType {
  // User preferences
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Exchange rates
  exchangeRates: ExchangeRates | null;
  refreshExchangeRates: () => Promise<void>;
  
  // Utility functions
  formatCurrency: (amount: number, currency?: SupportedCurrency) => string;
  convertCurrency: (amount: number, fromCurrency: SupportedCurrency, toCurrency?: SupportedCurrency) => Promise<number>;
  formatNumber: (value: number) => string;
  
  // Loading states
  isLoadingRates: boolean;
}

const GlobalizationContext = createContext<GlobalizationContextType | undefined>(undefined);

const STORAGE_KEY = 'valvechain_globalization_preferences';

// Default preferences
const getDefaultPreferences = (): UserPreferences => {
  const detectedLocale = localeService.detectUserLocale();
  return {
    currency: localeService.getCurrencyForLocale(detectedLocale),
    locale: detectedLocale,
    unitSystem: localeService.getUnitSystemForLocale(detectedLocale),
    autoDetectLocale: true
  };
};

// Load preferences from localStorage
const loadPreferences = (): UserPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the stored preferences
      if (parsed && typeof parsed === 'object') {
        return { ...getDefaultPreferences(), ...parsed };
      }
    }
  } catch (error) {
    console.warn('Failed to load globalization preferences:', error);
  }
  return getDefaultPreferences();
};

// Save preferences to localStorage
const savePreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.warn('Failed to save globalization preferences:', error);
  }
};

interface GlobalizationProviderProps {
  children: ReactNode;
}

export const GlobalizationProvider: React.FC<GlobalizationProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Load exchange rates on mount and set up refresh interval
  useEffect(() => {
    const loadInitialRates = async () => {
      setIsLoadingRates(true);
      try {
        const rates = await fxRateService.fetchRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error('Failed to load initial exchange rates:', error);
      } finally {
        setIsLoadingRates(false);
      }
    };

    loadInitialRates();

    // Refresh rates every 5 minutes
    const interval = setInterval(async () => {
      try {
        const rates = await fxRateService.fetchRates();
        setExchangeRates(rates);
      } catch (error) {
        console.warn('Failed to refresh exchange rates:', error);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Save preferences when they change
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  // Update preferences function
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      
      // If auto-detect is enabled and locale changes, update currency and unit system
      if (updated.autoDetectLocale && newPreferences.locale) {
        updated.currency = localeService.getCurrencyForLocale(newPreferences.locale);
        updated.unitSystem = localeService.getUnitSystemForLocale(newPreferences.locale);
      }
      
      return updated;
    });
  };

  // Refresh exchange rates manually
  const refreshExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      fxRateService.clearCache();
      const rates = await fxRateService.fetchRates();
      setExchangeRates(rates);
    } catch (error) {
      console.error('Failed to refresh exchange rates:', error);
      throw error;
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Format currency using user preferences
  const formatCurrency = (amount: number, currency?: SupportedCurrency): string => {
    const targetCurrency = currency || preferences.currency;
    return localeService.formatCurrency(amount, targetCurrency, preferences.locale);
  };

  // Convert currency using current exchange rates
  const convertCurrency = async (
    amount: number, 
    fromCurrency: SupportedCurrency, 
    toCurrency?: SupportedCurrency
  ): Promise<number> => {
    const targetCurrency = toCurrency || preferences.currency;
    return await fxRateService.convertCurrency(amount, fromCurrency, targetCurrency);
  };

  // Format number using user locale
  const formatNumber = (value: number): string => {
    return localeService.formatNumber(value, preferences.locale);
  };

  const contextValue: GlobalizationContextType = {
    preferences,
    updatePreferences,
    exchangeRates,
    refreshExchangeRates,
    formatCurrency,
    convertCurrency,
    formatNumber,
    isLoadingRates
  };

  return (
    <GlobalizationContext.Provider value={contextValue}>
      {children}
    </GlobalizationContext.Provider>
  );
};

// Hook to use globalization context
export const useGlobalization = (): GlobalizationContextType => {
  const context = useContext(GlobalizationContext);
  if (context === undefined) {
    throw new Error('useGlobalization must be used within a GlobalizationProvider');
  }
  return context;
};