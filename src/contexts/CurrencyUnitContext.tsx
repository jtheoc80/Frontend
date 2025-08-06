// Global context for currency and unit preferences

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, DEFAULT_CURRENCY, getCurrencyByCode } from '../types/currency.ts';
import { UnitSystem, DEFAULT_UNIT_SYSTEM, getUnitSystemByCode } from '../types/units.ts';
import { currencyService } from '../services/currencyService.ts';
import { unitService } from '../services/unitService.ts';

interface CurrencyUnitContextType {
  // Currency state
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
  
  // Unit system state  
  selectedUnitSystem: string;
  setUnitSystem: (system: string) => void;
  
  // Helper functions
  formatCurrency: (amount: number) => string;
  convertCurrency: (amount: number, fromCurrency?: string) => number;
  formatUnitValue: (value: number, unitCode: string) => string;
  convertUnit: (value: number, fromUnit: string, toUnit: string) => number | null;
  
  // Current currency and unit system objects
  currentCurrency: Currency | undefined;
  currentUnitSystem: UnitSystem | undefined;
  
  // Loading states
  isLoadingRates: boolean;
}

const CurrencyUnitContext = createContext<CurrencyUnitContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENCY: 'valvechain_currency',
  UNIT_SYSTEM: 'valvechain_unit_system'
};

interface CurrencyUnitProviderProps {
  children: ReactNode;
}

export const CurrencyUnitProvider: React.FC<CurrencyUnitProviderProps> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [selectedUnitSystem, setSelectedUnitSystem] = useState<string>(DEFAULT_UNIT_SYSTEM);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    const savedUnitSystem = localStorage.getItem(STORAGE_KEYS.UNIT_SYSTEM);
    
    if (savedCurrency && currencyService.isCurrencySupported(savedCurrency)) {
      setSelectedCurrency(savedCurrency);
    }
    
    if (savedUnitSystem && getUnitSystemByCode(savedUnitSystem)) {
      setSelectedUnitSystem(savedUnitSystem);
    }

    // Initial currency rate update
    setIsLoadingRates(true);
    currencyService.updateRates().finally(() => {
      setIsLoadingRates(false);
    });
  }, []);

  const setCurrency = (currency: string) => {
    if (currencyService.isCurrencySupported(currency)) {
      setSelectedCurrency(currency);
      localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
    }
  };

  const setUnitSystem = (system: string) => {
    if (getUnitSystemByCode(system)) {
      setSelectedUnitSystem(system);
      localStorage.setItem(STORAGE_KEYS.UNIT_SYSTEM, system);
    }
  };

  const formatCurrency = (amount: number) => {
    return currencyService.formatAmount(amount, selectedCurrency);
  };

  const convertCurrency = (amount: number, fromCurrency: string = DEFAULT_CURRENCY): number => {
    if (fromCurrency === selectedCurrency) return amount;
    const conversion = currencyService.convertCurrency(amount, fromCurrency, selectedCurrency);
    return conversion.convertedAmount;
  };

  const formatUnitValue = (value: number, unitCode: string): string => {
    return unitService.formatUnitValue(value, unitCode);
  };

  const convertUnit = (value: number, fromUnit: string, toUnit: string): number | null => {
    const conversion = unitService.convertUnit(value, fromUnit, toUnit);
    return conversion?.convertedValue || null;
  };

  const currentCurrency = getCurrencyByCode(selectedCurrency);
  const currentUnitSystem = getUnitSystemByCode(selectedUnitSystem);

  const value: CurrencyUnitContextType = {
    selectedCurrency,
    setCurrency,
    selectedUnitSystem,
    setUnitSystem,
    formatCurrency,
    convertCurrency,
    formatUnitValue,
    convertUnit,
    currentCurrency,
    currentUnitSystem,
    isLoadingRates
  };

  return (
    <CurrencyUnitContext.Provider value={value}>
      {children}
    </CurrencyUnitContext.Provider>
  );
};

// Custom hook to use the currency/unit context
export const useCurrencyUnit = (): CurrencyUnitContextType => {
  const context = useContext(CurrencyUnitContext);
  if (context === undefined) {
    throw new Error('useCurrencyUnit must be used within a CurrencyUnitProvider');
  }
  return context;
};

export default CurrencyUnitContext;