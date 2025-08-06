// Currency conversion service using external API

import { Currency, CurrencyRate, CurrencyConversion, SUPPORTED_CURRENCIES, getCurrencyByCode } from '../types/currency.ts';

class CurrencyService {
  private baseUrl = 'https://api.exchangerate-api.com/v4/latest';
  private fallbackUrl = 'https://api.fxratesapi.com/latest'; // Backup API
  private rates: Map<string, CurrencyRate> = new Map();
  private lastUpdate: string | null = null;
  private updateInterval = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Initialize with default rates to prevent API dependency during development
    this.initializeDefaultRates();
    // Start periodic updates
    this.startPeriodicUpdates();
  }

  /**
   * Initialize with reasonable default exchange rates
   */
  private initializeDefaultRates(): void {
    const defaultRates = [
      { code: 'USD', rate: 1.0 },
      { code: 'EUR', rate: 0.85 },
      { code: 'GBP', rate: 0.73 },
      { code: 'JPY', rate: 110.0 },
      { code: 'CAD', rate: 1.25 },
      { code: 'AUD', rate: 1.35 },
      { code: 'CHF', rate: 0.92 },
      { code: 'CNY', rate: 6.45 },
      { code: 'SEK', rate: 8.85 },
      { code: 'NOK', rate: 8.55 },
      { code: 'SAR', rate: 3.75 },
      { code: 'AED', rate: 3.67 },
    ];

    const timestamp = new Date().toISOString();
    defaultRates.forEach(rate => {
      this.rates.set(rate.code, {
        code: rate.code,
        rate: rate.rate,
        lastUpdated: timestamp
      });
    });
    this.lastUpdate = timestamp;
  }

  /**
   * Start periodic rate updates
   */
  private startPeriodicUpdates(): void {
    setInterval(() => {
      this.updateRates().catch(console.error);
    }, this.updateInterval);
    
    // Initial update after a short delay
    setTimeout(() => {
      this.updateRates().catch(console.error);
    }, 1000);
  }

  /**
   * Fetch latest exchange rates from API
   */
  async updateRates(baseCurrency: string = 'USD'): Promise<boolean> {
    try {
      const response = await this.fetchRatesWithFallback(baseCurrency);
      if (!response.rates) {
        throw new Error('Invalid API response format');
      }

      const timestamp = new Date().toISOString();
      
      // Update rates for all supported currencies
      SUPPORTED_CURRENCIES.forEach(currency => {
        const rate = currency.code === baseCurrency ? 1.0 : (response.rates[currency.code] || this.rates.get(currency.code)?.rate || 1.0);
        
        this.rates.set(currency.code, {
          code: currency.code,
          rate,
          lastUpdated: timestamp
        });
      });

      this.lastUpdate = timestamp;
      console.log('Currency rates updated successfully');
      return true;
    } catch (error) {
      console.warn('Failed to update currency rates, using cached rates:', error);
      return false;
    }
  }

  /**
   * Fetch rates with primary and fallback APIs
   */
  private async fetchRatesWithFallback(baseCurrency: string): Promise<any> {
    const urls = [
      `${this.baseUrl}/${baseCurrency}`,
      `${this.fallbackUrl}?base=${baseCurrency}&symbols=${SUPPORTED_CURRENCIES.map(c => c.code).join(',')}`
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (error) {
        console.warn(`Failed to fetch from ${url}:`, error);
      }
    }
    
    throw new Error('All currency APIs failed');
  }

  /**
   * Get exchange rate between two currencies
   */
  getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1.0;

    const fromRate = this.rates.get(fromCurrency)?.rate || 1.0;
    const toRate = this.rates.get(toCurrency)?.rate || 1.0;
    
    // Convert through USD as base currency
    return toRate / fromRate;
  }

  /**
   * Convert amount between currencies
   */
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): CurrencyConversion {
    const rate = this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;

    return {
      fromCurrency,
      toCurrency,
      amount,
      convertedAmount,
      rate,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get all current rates
   */
  getAllRates(): CurrencyRate[] {
    return Array.from(this.rates.values());
  }

  /**
   * Get last update timestamp
   */
  getLastUpdateTime(): string | null {
    return this.lastUpdate;
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): Currency[] {
    return SUPPORTED_CURRENCIES;
  }

  /**
   * Check if currency is supported
   */
  isCurrencySupported(currencyCode: string): boolean {
    return SUPPORTED_CURRENCIES.some(currency => currency.code === currencyCode);
  }

  /**
   * Format currency amount with proper localization
   */
  formatAmount(amount: number, currencyCode: string, locale: string = 'en-US'): string {
    const currency = getCurrencyByCode(currencyCode);
    if (!currency) return amount.toString();

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals
      }).format(amount);
    } catch (error) {
      // Fallback formatting
      return `${currency.symbol}${amount.toFixed(currency.decimals)}`;
    }
  }

  /**
   * Get currency rate status for debugging
   */
  getRateStatus(): { isOnline: boolean; lastUpdate: string | null; rateCount: number } {
    return {
      isOnline: this.lastUpdate !== null && Date.now() - new Date(this.lastUpdate).getTime() < this.updateInterval * 2,
      lastUpdate: this.lastUpdate,
      rateCount: this.rates.size
    };
  }
}

// Export singleton instance
export const currencyService = new CurrencyService();
export default currencyService;