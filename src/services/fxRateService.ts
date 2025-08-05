// Service for fetching real-time foreign exchange rates

import { ExchangeRates, SupportedCurrency } from '../types/globalization';

class FXRateService {
  private static instance: FXRateService;
  private cache: ExchangeRates | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly BASE_CURRENCY = 'USD';

  private constructor() {}

  public static getInstance(): FXRateService {
    if (!FXRateService.instance) {
      FXRateService.instance = new FXRateService();
    }
    return FXRateService.instance;
  }

  // Mock exchange rates for demo purposes
  // In a real implementation, this would call a service like exchangerate-api.com
  private getMockRates(): ExchangeRates {
    return {
      USD: 1.0,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 150.0,
      CNY: 7.25,
      INR: 83.0,
      CAD: 1.35,
      AUD: 1.55,
      ETH: 0.0004, // 1 USD = 0.0004 ETH (approximate)
      BTC: 0.000025, // 1 USD = 0.000025 BTC (approximate)
      timestamp: Date.now()
    };
  }

  public async fetchRates(): Promise<ExchangeRates> {
    // Check cache first
    if (this.cache && (Date.now() - this.cache.timestamp) < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      // In production, replace with actual API call
      // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      // const data = await response.json();
      
      // For now, use mock data
      const rates = this.getMockRates();
      this.cache = rates;
      return rates;
    } catch (error) {
      console.warn('Failed to fetch live exchange rates, using cached or default rates:', error);
      
      // Return cached rates or defaults
      if (this.cache) {
        return this.cache;
      }
      
      const fallbackRates = this.getMockRates();
      this.cache = fallbackRates;
      return fallbackRates;
    }
  }

  public async convertCurrency(
    amount: number, 
    fromCurrency: SupportedCurrency, 
    toCurrency: SupportedCurrency
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rates = await this.fetchRates();
    
    // Convert to USD first, then to target currency
    const amountInUSD = fromCurrency === 'USD' ? amount : amount / rates[fromCurrency];
    const convertedAmount = toCurrency === 'USD' ? amountInUSD : amountInUSD * rates[toCurrency];
    
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  }

  public async getExchangeRate(
    fromCurrency: SupportedCurrency, 
    toCurrency: SupportedCurrency
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return 1.0;
    }

    const rates = await this.fetchRates();
    
    // Calculate rate from base currency (USD)
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    
    return toRate / fromRate;
  }

  public clearCache(): void {
    this.cache = null;
  }
}

export const fxRateService = FXRateService.getInstance();