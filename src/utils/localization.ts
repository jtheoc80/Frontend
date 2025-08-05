/**
 * Localization utilities for date, time, and number formatting
 */

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
export function getLocaleConfig(): LocaleConfig {
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
export function setLocaleConfig(config: Partial<LocaleConfig>): void {
  try {
    const currentConfig = getLocaleConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('valvechain-locale-config', JSON.stringify(newConfig));
  } catch (error) {
    console.warn('Failed to save locale configuration:', error);
  }
}

/**
 * Format date according to user's locale and timezone
 */
export function formatDate(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const config = getLocaleConfig();
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: config.timezone,
    ...options,
  };

  return new Intl.DateTimeFormat(config.locale, defaultOptions).format(dateObj);
}

/**
 * Format date and time according to user's locale and timezone
 */
export function formatDateTime(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const config = getLocaleConfig();
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: config.timezone,
    ...options,
  };

  return new Intl.DateTimeFormat(config.locale, defaultOptions).format(dateObj);
}

/**
 * Format time according to user's locale and timezone
 */
export function formatTime(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const config = getLocaleConfig();
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Time';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: config.timezone,
    ...options,
  };

  return new Intl.DateTimeFormat(config.locale, defaultOptions).format(dateObj);
}

/**
 * Format number according to user's locale
 */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const config = getLocaleConfig();
  
  if (isNaN(value)) {
    return 'NaN';
  }

  return new Intl.NumberFormat(config.locale, options).format(value);
}

/**
 * Format currency according to user's locale and currency preference
 */
export function formatCurrency(
  amount: number,
  currency?: string,
  options: Intl.NumberFormatOptions = {}
): string {
  const config = getLocaleConfig();
  const currencyCode = currency || config.currency;
  
  if (isNaN(amount)) {
    return 'NaN';
  }

  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currencyCode,
    ...options,
  };

  return new Intl.NumberFormat(config.locale, defaultOptions).format(amount);
}

/**
 * Format large numbers with appropriate units (K, M, B)
 */
export function formatLargeNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const config = getLocaleConfig();
  
  if (isNaN(value)) {
    return 'NaN';
  }

  const defaultOptions: Intl.NumberFormatOptions = {
    notation: 'compact',
    compactDisplay: 'short',
    ...options,
  };

  return new Intl.NumberFormat(config.locale, defaultOptions).format(value);
}

/**
 * Format percentage according to user's locale
 */
export function formatPercentage(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const config = getLocaleConfig();
  
  if (isNaN(value)) {
    return 'NaN';
  }

  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  };

  return new Intl.NumberFormat(config.locale, defaultOptions).format(value);
}

/**
 * Format date for HTML input fields (YYYY-MM-DD format)
 */
export function formatDateForInput(date: Date | number | string): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toISOString().split('T')[0];
}