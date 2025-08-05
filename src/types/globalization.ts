// Types for globalization features (currency and unit support)

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR' | 'CAD' | 'AUD' | 'ETH' | 'BTC';

export type SupportedLocale = 'en-US' | 'en-GB' | 'de-DE' | 'fr-FR' | 'es-ES' | 'ja-JP' | 'zh-CN' | 'hi-IN' | 'en-CA' | 'en-AU';

export type UnitSystem = 'metric' | 'imperial';

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  decimalPlaces: number;
}

export interface UnitConversion {
  // Pressure units
  pressure: {
    metric: 'bar' | 'kPa' | 'MPa';
    imperial: 'psi' | 'psig';
  };
  // Length/diameter units  
  length: {
    metric: 'mm' | 'cm' | 'm';
    imperial: 'in' | 'ft';
  };
  // Temperature units
  temperature: {
    metric: 'C';
    imperial: 'F';
  };
  // Flow rate units
  flow: {
    metric: 'L/min' | 'm³/h';
    imperial: 'gpm' | 'cfm';
  };
}

export interface ExchangeRates {
  [key: string]: number; // Currency code to rate
  timestamp: number;
}

export interface UserPreferences {
  currency: SupportedCurrency;
  locale: SupportedLocale;
  unitSystem: UnitSystem;
  autoDetectLocale: boolean;
}

export interface LocalizedValue {
  value: number;
  currency?: SupportedCurrency;
  unit?: string;
  displayValue: string;
}

export interface ConversionResult {
  originalValue: number;
  convertedValue: number;
  fromUnit: string;
  toUnit: string;
  conversionRate: number;
}