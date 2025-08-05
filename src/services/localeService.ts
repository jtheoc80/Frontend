// Service for locale detection and currency/unit system mapping

import { SupportedLocale, SupportedCurrency, UnitSystem, CurrencyInfo } from '../types/globalization';

class LocaleService {
  private static instance: LocaleService;

  private constructor() {}

  public static getInstance(): LocaleService {
    if (!LocaleService.instance) {
      LocaleService.instance = new LocaleService();
    }
    return LocaleService.instance;
  }

  // Currency information database
  private readonly currencyInfo: Record<SupportedCurrency, CurrencyInfo> = {
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimalPlaces: 2 },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimalPlaces: 2 },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimalPlaces: 2 },
    JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimalPlaces: 0 },
    CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimalPlaces: 2 },
    INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimalPlaces: 2 },
    CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimalPlaces: 2 },
    AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimalPlaces: 2 },
    ETH: { code: 'ETH', symbol: 'Ξ', name: 'Ethereum', decimalPlaces: 6 },
    BTC: { code: 'BTC', symbol: '₿', name: 'Bitcoin', decimalPlaces: 8 }
  };

  // Locale to currency mapping
  private readonly localeCurrencyMap: Record<SupportedLocale, SupportedCurrency> = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'de-DE': 'EUR',
    'fr-FR': 'EUR',
    'es-ES': 'EUR',
    'ja-JP': 'JPY',
    'zh-CN': 'CNY',
    'hi-IN': 'INR',
    'en-CA': 'CAD',
    'en-AU': 'AUD'
  };

  // Locale to unit system mapping
  private readonly localeUnitSystemMap: Record<SupportedLocale, UnitSystem> = {
    'en-US': 'imperial',
    'en-GB': 'metric', // UK uses metric for most measurements
    'de-DE': 'metric',
    'fr-FR': 'metric',
    'es-ES': 'metric',
    'ja-JP': 'metric',
    'zh-CN': 'metric',
    'hi-IN': 'metric',
    'en-CA': 'metric', // Canada uses metric
    'en-AU': 'metric'  // Australia uses metric
  };

  /**
   * Detect user's locale from browser settings
   */
  public detectUserLocale(): SupportedLocale {
    const browserLocale = navigator.language || 'en-US';
    
    // Try exact match first
    if (this.isSupportedLocale(browserLocale)) {
      return browserLocale as SupportedLocale;
    }

    // Try language code match (e.g., 'en' -> 'en-US')
    const languageCode = browserLocale.split('-')[0];
    const supportedLocales = Object.keys(this.localeCurrencyMap) as SupportedLocale[];
    
    const matchingLocale = supportedLocales.find(locale => 
      locale.startsWith(languageCode)
    );

    return matchingLocale || 'en-US'; // Default fallback
  }

  /**
   * Get currency for a given locale
   */
  public getCurrencyForLocale(locale: SupportedLocale): SupportedCurrency {
    return this.localeCurrencyMap[locale] || 'USD';
  }

  /**
   * Get unit system for a given locale
   */
  public getUnitSystemForLocale(locale: SupportedLocale): UnitSystem {
    return this.localeUnitSystemMap[locale] || 'metric';
  }

  /**
   * Get currency information
   */
  public getCurrencyInfo(currency: SupportedCurrency): CurrencyInfo {
    return this.currencyInfo[currency];
  }

  /**
   * Get all supported currencies
   */
  public getAllCurrencies(): CurrencyInfo[] {
    return Object.values(this.currencyInfo);
  }

  /**
   * Get all supported locales
   */
  public getAllLocales(): SupportedLocale[] {
    return Object.keys(this.localeCurrencyMap) as SupportedLocale[];
  }

  /**
   * Format currency value according to locale
   */
  public formatCurrency(
    amount: number, 
    currency: SupportedCurrency, 
    locale: SupportedLocale = 'en-US'
  ): string {
    const currencyInfo = this.getCurrencyInfo(currency);
    
    try {
      // Use Intl.NumberFormat for proper locale formatting
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency === 'ETH' || currency === 'BTC' ? 'USD' : currency,
        minimumFractionDigits: currencyInfo.decimalPlaces,
        maximumFractionDigits: currencyInfo.decimalPlaces
      });

      // For crypto currencies, customize the format
      if (currency === 'ETH' || currency === 'BTC') {
        const formatted = amount.toFixed(currencyInfo.decimalPlaces);
        return `${currencyInfo.symbol}${formatted}`;
      }

      return formatter.format(amount);
    } catch (error) {
      // Fallback formatting if Intl fails
      const formatted = amount.toFixed(currencyInfo.decimalPlaces);
      return `${currencyInfo.symbol}${formatted}`;
    }
  }

  /**
   * Format number according to locale
   */
  public formatNumber(value: number, locale: SupportedLocale = 'en-US'): string {
    try {
      return new Intl.NumberFormat(locale).format(value);
    } catch (error) {
      return value.toString();
    }
  }

  /**
   * Check if a locale is supported
   */
  private isSupportedLocale(locale: string): boolean {
    return Object.keys(this.localeCurrencyMap).includes(locale);
  }

  /**
   * Get locale display name
   */
  public getLocaleDisplayName(locale: SupportedLocale): string {
    const localeNames: Record<SupportedLocale, string> = {
      'en-US': 'English (United States)',
      'en-GB': 'English (United Kingdom)',
      'de-DE': 'Deutsch (Deutschland)',
      'fr-FR': 'Français (France)',
      'es-ES': 'Español (España)',
      'ja-JP': '日本語 (日本)',
      'zh-CN': '中文 (中国)',
      'hi-IN': 'हिन्दी (भारत)',
      'en-CA': 'English (Canada)',
      'en-AU': 'English (Australia)'
    };

    return localeNames[locale] || locale;
  }
}

export const localeService = LocaleService.getInstance();