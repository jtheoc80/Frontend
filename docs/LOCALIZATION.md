# Localization Documentation

## Overview

The ValveChain frontend application now supports full localization for date, time, and number formatting. The application can detect the user's browser locale and timezone, store preferences, and format all date/time/number displays according to the user's regional settings.

## Features

### 1. Locale Detection and Storage
- Automatically detects browser locale and timezone on first visit
- Stores user preferences in localStorage
- Provides sensible defaults if detection fails

### 2. Date and Time Formatting
- All dates and times are formatted according to the user's locale
- Timezone support for accurate time display
- Consistent formatting across the application

### 3. Number and Currency Formatting
- Numbers use locale-appropriate delimiters (e.g., `1,000.00` vs `1.000,00`)
- Currency formatting with correct symbols and positioning
- Support for large number formatting with compact notation (K, M, B)

### 4. Multi-language Support
The application supports the following locales:
- **en-US** - English (United States)
- **en-GB** - English (United Kingdom)  
- **fr-FR** - Français (France)
- **de-DE** - Deutsch (Deutschland)
- **es-ES** - Español (España)
- **it-IT** - Italiano (Italia)
- **ru-RU** - Русский (Россия)
- **ja-JP** - 日本語 (日本)
- **zh-CN** - 中文 (中国)

### 5. Timezone Support
Common timezones are supported including:
- Americas: New York, Chicago, Denver, Los Angeles
- Europe: London, Paris, Berlin, Moscow
- Asia: Tokyo, Shanghai
- Australia: Sydney
- UTC

### 6. Currency Support
- USD, EUR, GBP, JPY, CNY, RUB, CAD, AUD

## Configuration

### Setting User Preferences

Users can configure their locale preferences through the settings panel accessible via the globe icon (🌐) in the dashboard header.

#### Programmatic Configuration

```typescript
import { setLocaleConfig } from 'utils/localization';

// Set specific locale settings
setLocaleConfig({
  locale: 'de-DE',
  timezone: 'Europe/Berlin',
  currency: 'EUR'
});
```

#### Using the React Context

```typescript
import { useLocale } from 'contexts/LocaleContext';

function MyComponent() {
  const { config, updateLocale } = useLocale();
  
  // Update locale settings
  const handleLocaleChange = () => {
    updateLocale({
      locale: 'fr-FR',
      currency: 'EUR'
    });
  };
  
  return (
    <div>
      Current locale: {config.locale}
      <button onClick={handleLocaleChange}>Switch to French</button>
    </div>
  );
}
```

## Usage Examples

### Formatting Functions

```typescript
import { 
  formatDate, 
  formatDateTime, 
  formatTime,
  formatNumber,
  formatCurrency,
  formatLargeNumber,
  formatPercentage,
  formatDateForInput
} from 'utils/localization';

// Date formatting
const date = new Date('2024-01-15T10:30:00Z');
formatDate(date); // "15. Jan. 2024" (German locale)
formatDateTime(date); // "15. Jan. 2024, 11:30" (German locale, Berlin timezone)
formatTime(date); // "11:30" (German locale, Berlin timezone)

// Number formatting  
formatNumber(1000.5); // "1.000,5" (German locale)
formatCurrency(1000.5); // "1.000,50 €" (German locale, EUR currency)
formatLargeNumber(1000000); // "1 Mio." (German locale, compact notation)
formatPercentage(0.125); // "12,5 %" (German locale)

// For HTML date inputs
formatDateForInput(date); // "2024-01-15" (ISO format)
```

### Component Integration

Components automatically use the user's locale settings when calling the formatting functions:

```typescript
// ValveHistoryPanel.tsx - Updated to use locale-aware formatting
<Text><b>Date:</b> {formatDateTime(Number(m.timestamp) * 1000)}</Text>
<Text><b>Amount:</b> {formatCurrency(Number(repair[3]), 'ETH')}</Text>

// POListSimple.tsx - Updated to use locale-aware formatting  
<td>{formatDate(po.timestamp)}</td>
<td>{formatCurrency(po.totalAmount, po.currency)}</td>
```

## Implementation Details

### Core Components

1. **`src/utils/localization.ts`** - Core localization utilities
2. **`src/contexts/LocaleContext.tsx`** - React context for locale management
3. **`src/components/LocaleSettings.tsx`** - UI component for locale configuration

### Integration Points

The following components have been updated to use localized formatting:

- **ValveHistoryPanel.tsx** - Date/time and currency formatting
- **POListSimple.tsx** - Date and currency formatting  
- **CreatePOFormSimple.tsx** - Date input formatting
- **ValveHistoryTable.tsx** - Date column formatting (ready for integration)

### Storage

User preferences are stored in localStorage with the key `valvechain-locale-config` as a JSON object:

```json
{
  "locale": "de-DE",
  "timezone": "Europe/Berlin", 
  "currency": "EUR"
}
```

## Testing

Comprehensive unit tests are included in `src/__tests__/localization.test.ts` covering:

- Configuration management (get/set)
- Date and time formatting across locales
- Number and currency formatting
- Error handling for invalid inputs
- Locale-specific formatting validation for en-US, fr-FR, de-DE, and ru-RU

Run tests with:
```bash
npm test -- --testPathPattern=localization.test.ts
```

## Browser Compatibility

The localization features use the standard `Intl` API which is supported in:
- Chrome 24+
- Firefox 29+
- Safari 10+
- Edge 12+

## Performance Considerations

- Locale configuration is cached in memory after first load
- Formatting functions use native `Intl` APIs for optimal performance
- LocalStorage operations are wrapped in try-catch for resilience

## Future Enhancements

Potential future improvements:
- RTL language support
- Additional locale-specific formatting options
- Server-side locale detection
- Translation of UI text (i18n)
- Custom number formatting patterns