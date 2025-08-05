import { 
  getLocaleConfig, 
  setLocaleConfig, 
  formatDate, 
  formatDateTime, 
  formatTime, 
  formatNumber, 
  formatCurrency, 
  formatLargeNumber, 
  formatPercentage,
  formatDateForInput,
  LocaleConfig 
} from '../utils/localization';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock navigator.language
Object.defineProperty(navigator, 'language', {
  writable: true,
  value: 'en-US'
});

describe('Localization Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getLocaleConfig', () => {
    it('should return default config when no stored config exists', () => {
      const config = getLocaleConfig();
      expect(config.locale).toBe('en-US');
      expect(config.currency).toBe('USD');
      expect(config.timezone).toBeDefined();
    });

    it('should return stored config when it exists', () => {
      const testConfig = {
        locale: 'fr-FR',
        timezone: 'Europe/Paris',
        currency: 'EUR'
      };
      localStorage.setItem('valvechain-locale-config', JSON.stringify(testConfig));
      
      const config = getLocaleConfig();
      expect(config.locale).toBe('fr-FR');
      expect(config.timezone).toBe('Europe/Paris');
      expect(config.currency).toBe('EUR');
    });

    it('should handle invalid stored config gracefully', () => {
      localStorage.setItem('valvechain-locale-config', 'invalid-json');
      
      const config = getLocaleConfig();
      expect(config.locale).toBe('en-US');
      expect(config.currency).toBe('USD');
    });
  });

  describe('setLocaleConfig', () => {
    it('should save partial config updates', () => {
      const originalConfig = getLocaleConfig();
      
      setLocaleConfig({ locale: 'de-DE' });
      
      const updatedConfig = getLocaleConfig();
      expect(updatedConfig.locale).toBe('de-DE');
      expect(updatedConfig.timezone).toBe(originalConfig.timezone);
      expect(updatedConfig.currency).toBe(originalConfig.currency);
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      setLocaleConfig({ locale: 'en-US', timezone: 'America/New_York' });
    });

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan 15, 2024/);
    });

    it('should format timestamp correctly', () => {
      const timestamp = new Date('2024-01-15T10:30:00Z').getTime();
      const formatted = formatDate(timestamp);
      expect(formatted).toMatch(/Jan 15, 2024/);
    });

    it('should handle ISO string dates', () => {
      const isoString = '2024-01-15T10:30:00Z';
      const formatted = formatDate(isoString);
      expect(formatted).toMatch(/Jan 15, 2024/);
    });

    it('should handle invalid dates', () => {
      const formatted = formatDate('invalid-date');
      expect(formatted).toBe('Invalid Date');
    });

    it('should use different locale formats', () => {
      setLocaleConfig({ locale: 'de-DE' });
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/15\. Jan\.? 2024/);
    });
  });

  describe('formatDateTime', () => {
    beforeEach(() => {
      setLocaleConfig({ locale: 'en-US', timezone: 'America/New_York' });
    });

    it('should format date and time correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDateTime(date);
      expect(formatted).toMatch(/Jan 15, 2024.*\d{1,2}:\d{2}\s?(AM|PM)/);
    });

    it('should handle invalid dates', () => {
      const formatted = formatDateTime('invalid-date');
      expect(formatted).toBe('Invalid Date');
    });
  });

  describe('formatTime', () => {
    beforeEach(() => {
      setLocaleConfig({ locale: 'en-US', timezone: 'America/New_York' });
    });

    it('should format time correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatTime(date);
      expect(formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
    });

    it('should handle invalid dates', () => {
      const formatted = formatTime('invalid-date');
      expect(formatted).toBe('Invalid Time');
    });
  });

  describe('formatNumber', () => {
    beforeEach(() => {
      setLocaleConfig({ locale: 'en-US' });
    });

    it('should format numbers with default locale', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000.5)).toBe('1,000.5');
    });

    it('should format numbers with German locale', () => {
      setLocaleConfig({ locale: 'de-DE' });
      expect(formatNumber(1000)).toBe('1.000');
      expect(formatNumber(1000.5)).toBe('1.000,5');
    });

    it('should handle NaN', () => {
      expect(formatNumber(NaN)).toBe('NaN');
    });
  });

  describe('formatCurrency', () => {
    beforeEach(() => {
      setLocaleConfig({ locale: 'en-US', currency: 'USD' });
    });

    it('should format currency with default settings', () => {
      const formatted = formatCurrency(1000);
      expect(formatted).toBe('$1,000.00');
    });

    it('should format currency with specified currency', () => {
      const formatted = formatCurrency(1000, 'EUR');
      expect(formatted).toBe('€1,000.00');
    });

    it('should use different locale formats', () => {
      setLocaleConfig({ locale: 'de-DE', currency: 'EUR' });
      const formatted = formatCurrency(1000);
      expect(formatted).toMatch(/1\.000,00.*€/);
    });

    it('should handle NaN', () => {
      expect(formatCurrency(NaN)).toBe('NaN');
    });
  });

  describe('formatLargeNumber', () => {
    beforeEach(() => {
      setLocaleConfig({ locale: 'en-US' });
    });

    it('should format large numbers with compact notation', () => {
      expect(formatLargeNumber(1000)).toBe('1K');
      expect(formatLargeNumber(1000000)).toBe('1M');
      expect(formatLargeNumber(1000000000)).toBe('1B');
    });

    it('should handle NaN', () => {
      expect(formatLargeNumber(NaN)).toBe('NaN');
    });
  });

  describe('formatPercentage', () => {
    beforeEach(() => {
      setLocaleConfig({ locale: 'en-US' });
    });

    it('should format percentages correctly', () => {
      expect(formatPercentage(0.1)).toMatch(/10\s?%/);
      expect(formatPercentage(0.125)).toMatch(/12\.?5?\s?%/);
    });

    it('should handle NaN', () => {
      expect(formatPercentage(NaN)).toBe('NaN');
    });
  });

  describe('formatDateForInput', () => {
    it('should format dates for HTML input fields', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDateForInput(date);
      expect(formatted).toBe('2024-01-15');
    });

    it('should handle timestamps', () => {
      const timestamp = new Date('2024-01-15T10:30:00Z').getTime();
      const formatted = formatDateForInput(timestamp);
      expect(formatted).toBe('2024-01-15');
    });

    it('should handle ISO strings', () => {
      const formatted = formatDateForInput('2024-01-15T10:30:00Z');
      expect(formatted).toBe('2024-01-15');
    });

    it('should handle invalid dates', () => {
      const formatted = formatDateForInput('invalid-date');
      expect(formatted).toBe('');
    });
  });

  describe('Locale-specific formatting tests', () => {
    const testCases = [
      {
        locale: 'en-US',
        expectedDate: /Jan 15, 2024/,
        expectedNumber: '1,000.5',
        expectedCurrency: '$1,000.50'
      },
      {
        locale: 'fr-FR',
        expectedDate: /15 janv\. 2024/,
        expectedNumber: /1\s000,5/,
        expectedCurrency: /1\s000,50.*€/
      },
      {
        locale: 'de-DE',
        expectedDate: /15\. Jan\.? 2024/,
        expectedNumber: /1\.000,5/,
        expectedCurrency: /1\.000,50.*€/
      },
      {
        locale: 'ru-RU',
        expectedDate: /15 янв\. 2024 г\./,
        expectedNumber: /1\s000,5/,
        expectedCurrency: /1\s000,50.*₽/
      }
    ];

    testCases.forEach(({ locale, expectedDate, expectedNumber, expectedCurrency }) => {
      describe(`${locale} locale`, () => {
        beforeEach(() => {
          setLocaleConfig({ 
            locale, 
            currency: locale === 'en-US' ? 'USD' : locale === 'ru-RU' ? 'RUB' : 'EUR'
          });
        });

        it('should format dates according to locale', () => {
          const date = new Date('2024-01-15T10:30:00Z');
          const formatted = formatDate(date);
          expect(formatted).toMatch(expectedDate);
        });

        it('should format numbers according to locale', () => {
          const formatted = formatNumber(1000.5);
          expect(formatted).toMatch(expectedNumber);
        });

        it('should format currency according to locale', () => {
          const formatted = formatCurrency(1000.5);
          expect(formatted).toMatch(expectedCurrency);
        });
      });
    });
  });
});