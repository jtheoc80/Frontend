// Tests for globalization functionality

import { fxRateService } from '../services/fxRateService';
import { unitConversionService } from '../services/unitConversionService';
import { localeService } from '../services/localeService';

describe('FX Rate Service', () => {
  test('should convert USD to EUR', async () => {
    const result = await fxRateService.convertCurrency(100, 'USD', 'EUR');
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(100); // EUR is typically stronger than USD
  });

  test('should return same amount for same currency conversion', async () => {
    const result = await fxRateService.convertCurrency(100, 'USD', 'USD');
    expect(result).toBe(100);
  });

  test('should fetch exchange rates', async () => {
    const rates = await fxRateService.fetchRates();
    expect(rates).toHaveProperty('USD');
    expect(rates).toHaveProperty('EUR');
    expect(rates.USD).toBe(1.0); // USD is base currency
    expect(rates.timestamp).toBeDefined();
  });
});

describe('Unit Conversion Service', () => {
  test('should convert pressure from psi to bar', () => {
    const result = unitConversionService.convertPressure(100, 'psi', 'bar');
    expect(result.convertedValue).toBeCloseTo(6.895, 2);
    expect(result.fromUnit).toBe('psi');
    expect(result.toUnit).toBe('bar');
  });

  test('should convert length from inches to mm', () => {
    const result = unitConversionService.convertLength(6, 'in', 'mm');
    expect(result.convertedValue).toBeCloseTo(152.4, 1);
    expect(result.fromUnit).toBe('in');
    expect(result.toUnit).toBe('mm');
  });

  test('should convert temperature from F to C', () => {
    const result = unitConversionService.convertTemperature(212, 'F', 'C');
    expect(result.convertedValue).toBeCloseTo(100, 1);
    expect(result.fromUnit).toBe('F');
    expect(result.toUnit).toBe('C');
  });

  test('should get units for metric system', () => {
    const units = unitConversionService.getUnitsForSystem('metric');
    expect(units.pressure).toBe('bar');
    expect(units.length).toBe('mm');
    expect(units.temperature).toBe('C');
  });

  test('should get units for imperial system', () => {
    const units = unitConversionService.getUnitsForSystem('imperial');
    expect(units.pressure).toBe('psi');
    expect(units.length).toBe('in');
    expect(units.temperature).toBe('F');
  });
});

describe('Locale Service', () => {
  test('should detect user locale', () => {
    const locale = localeService.detectUserLocale();
    expect(locale).toBeDefined();
    expect(typeof locale).toBe('string');
  });

  test('should get currency for locale', () => {
    const currency = localeService.getCurrencyForLocale('en-US');
    expect(currency).toBe('USD');
    
    const euroCurrency = localeService.getCurrencyForLocale('de-DE');
    expect(euroCurrency).toBe('EUR');
  });

  test('should get unit system for locale', () => {
    const unitSystem = localeService.getUnitSystemForLocale('en-US');
    expect(unitSystem).toBe('imperial');
    
    const metricSystem = localeService.getUnitSystemForLocale('de-DE');
    expect(metricSystem).toBe('metric');
  });

  test('should format currency', () => {
    const formatted = localeService.formatCurrency(1234.56, 'USD', 'en-US');
    expect(formatted).toContain('$');
    expect(formatted).toContain('1,234.56');
  });

  test('should get currency info', () => {
    const info = localeService.getCurrencyInfo('USD');
    expect(info.code).toBe('USD');
    expect(info.symbol).toBe('$');
    expect(info.name).toBe('US Dollar');
    expect(info.decimalPlaces).toBe(2);
  });

  test('should get all currencies', () => {
    const currencies = localeService.getAllCurrencies();
    expect(currencies.length).toBeGreaterThan(0);
    expect(currencies.some(c => c.code === 'USD')).toBe(true);
    expect(currencies.some(c => c.code === 'EUR')).toBe(true);
  });
});

describe('Unit Conversion Edge Cases', () => {
  test('should handle same unit conversion', () => {
    const result = unitConversionService.convertPressure(100, 'bar', 'bar');
    expect(result.convertedValue).toBe(100);
    expect(result.conversionRate).toBe(1);
  });

  test('should handle invalid units gracefully', () => {
    expect(() => {
      unitConversionService.convertPressure(100, 'invalid', 'bar');
    }).toThrow('Unsupported pressure unit: invalid');
  });

  test('should convert to preferred units based on system', () => {
    const result = unitConversionService.convertToPreferredUnits(100, 'psi', 'pressure', 'metric');
    expect(result.toUnit).toBe('bar');
    expect(result.convertedValue).toBeCloseTo(6.895, 2);
  });
});