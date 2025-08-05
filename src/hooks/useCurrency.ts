// Hook for currency conversion and formatting

import { useState, useEffect } from 'react';
import { useGlobalization } from '../contexts/GlobalizationContext';
import { SupportedCurrency, LocalizedValue } from '../types/globalization';

export const useCurrency = () => {
  const { preferences, formatCurrency, convertCurrency, exchangeRates, isLoadingRates } = useGlobalization();

  /**
   * Convert and format a currency value to user's preferred currency
   */
  const convertAndFormat = async (
    amount: number, 
    fromCurrency: SupportedCurrency
  ): Promise<LocalizedValue> => {
    try {
      const convertedAmount = await convertCurrency(amount, fromCurrency, preferences.currency);
      const displayValue = formatCurrency(convertedAmount, preferences.currency);
      
      return {
        value: convertedAmount,
        currency: preferences.currency,
        displayValue
      };
    } catch (error) {
      console.warn('Currency conversion failed, using original value:', error);
      const displayValue = formatCurrency(amount, fromCurrency);
      
      return {
        value: amount,
        currency: fromCurrency,
        displayValue
      };
    }
  };

  /**
   * Get exchange rate between two currencies
   */
  const getExchangeRate = (fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency): number => {
    if (!exchangeRates || fromCurrency === toCurrency) {
      return 1.0;
    }

    return exchangeRates[toCurrency] / exchangeRates[fromCurrency];
  };

  /**
   * Format currency without conversion
   */
  const format = (amount: number, currency?: SupportedCurrency): string => {
    return formatCurrency(amount, currency);
  };

  return {
    convertAndFormat,
    getExchangeRate,
    format,
    userCurrency: preferences.currency,
    userLocale: preferences.locale,
    isLoadingRates
  };
};

/**
 * Hook for handling multiple currency values with conversion
 */
export const useCurrencyList = (
  values: Array<{ amount: number; currency: SupportedCurrency }>
) => {
  const { convertAndFormat } = useCurrency();
  const [convertedValues, setConvertedValues] = useState<LocalizedValue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const convertValues = async () => {
      if (values.length === 0) {
        setConvertedValues([]);
        return;
      }

      setIsLoading(true);
      try {
        const promises = values.map(({ amount, currency }) => 
          convertAndFormat(amount, currency)
        );
        const results = await Promise.all(promises);
        setConvertedValues(results);
      } catch (error) {
        console.error('Failed to convert currency values:', error);
        // Fallback to original values
        const fallbackValues = values.map(({ amount, currency }) => ({
          value: amount,
          currency,
          displayValue: `${currency} ${amount.toFixed(2)}`
        }));
        setConvertedValues(fallbackValues);
      } finally {
        setIsLoading(false);
      }
    };

    convertValues();
  }, [values, convertAndFormat]);

  return {
    values: convertedValues,
    isLoading
  };
};