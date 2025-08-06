// Tests for currency service functionality

import { currencyService } from '../../services/currencyService';
import { SUPPORTED_CURRENCIES } from '../../types/currency';

describe('CurrencyService', () => {
  beforeEach(() => {
    // Reset service state for each test
    jest.clearAllMocks();
  });

  describe('Currency Support', () => {
    test('should support all defined currencies', () => {
      SUPPORTED_CURRENCIES.forEach(currency => {
        expect(currencyService.isCurrencySupported(currency.code)).toBe(true);
      });
    });

    test('should not support invalid currencies', () => {
      expect(currencyService.isCurrencySupported('INVALID')).toBe(false);
      expect(currencyService.isCurrencySupported('')).toBe(false);
    });

    test('should return supported currencies list', () => {
      const currencies = currencyService.getSupportedCurrencies();
      expect(currencies).toEqual(SUPPORTED_CURRENCIES);
      expect(currencies.length).toBeGreaterThan(5);
    });
  });

  describe('Exchange Rates', () => {
    test('should return 1 for same currency conversion', () => {
      const rate = currencyService.getExchangeRate('USD', 'USD');
      expect(rate).toBe(1.0);
    });

    test('should return valid rate for different currencies', () => {
      const rate = currencyService.getExchangeRate('USD', 'EUR');
      expect(rate).toBeGreaterThan(0);
      expect(typeof rate).toBe('number');
    });

    test('should return all rates', () => {
      const rates = currencyService.getAllRates();
      expect(rates.length).toBeGreaterThan(0);
      expect(rates[0]).toHaveProperty('code');
      expect(rates[0]).toHaveProperty('rate');
      expect(rates[0]).toHaveProperty('lastUpdated');
    });
  });

  describe('Currency Conversion', () => {
    test('should convert currency amounts correctly', () => {
      const conversion = currencyService.convertCurrency(100, 'USD', 'USD');
      expect(conversion.fromCurrency).toBe('USD');
      expect(conversion.toCurrency).toBe('USD');
      expect(conversion.amount).toBe(100);
      expect(conversion.convertedAmount).toBe(100);
      expect(conversion.rate).toBe(1.0);
    });

    test('should convert between different currencies', () => {
      const conversion = currencyService.convertCurrency(100, 'USD', 'EUR');
      expect(conversion.fromCurrency).toBe('USD');
      expect(conversion.toCurrency).toBe('EUR');
      expect(conversion.amount).toBe(100);
      expect(conversion.convertedAmount).toBeGreaterThan(0);
      expect(conversion.rate).toBeGreaterThan(0);
    });

    test('should handle zero amounts', () => {
      const conversion = currencyService.convertCurrency(0, 'USD', 'EUR');
      expect(conversion.convertedAmount).toBe(0);
    });
  });

  describe('Currency Formatting', () => {
    test('should format USD currency correctly', () => {
      const formatted = currencyService.formatAmount(1234.56, 'USD');
      expect(formatted).toMatch(/\$.*1,234\.56/);
    });

    test('should format EUR currency correctly', () => {
      const formatted = currencyService.formatAmount(1234.56, 'EUR');
      expect(formatted).toMatch(/€.*1,234\.56/);
    });

    test('should format JPY currency without decimals', () => {
      const formatted = currencyService.formatAmount(1234, 'JPY');
      expect(formatted).toMatch(/¥.*1,234/);
      expect(formatted).not.toMatch(/\./);
    });

    test('should handle invalid currency codes gracefully', () => {
      const formatted = currencyService.formatAmount(100, 'INVALID');
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('100');
    });
  });

  describe('Rate Status', () => {
    test('should return rate status', () => {
      const status = currencyService.getRateStatus();
      expect(status).toHaveProperty('isOnline');
      expect(status).toHaveProperty('lastUpdate');
      expect(status).toHaveProperty('rateCount');
      expect(typeof status.isOnline).toBe('boolean');
      expect(status.rateCount).toBeGreaterThan(0);
    });
  });
});