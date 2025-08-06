# Multi-Currency and Multi-Unit Support

This document describes the multi-currency and multi-unit functionality implemented in the ValveChain Frontend application.

## Overview

The application now supports:
- **12 currencies** with live exchange rates
- **3 unit systems** (Imperial/US, Metric, SI)
- **Real-time conversion** throughout the application
- **Persistent user preferences** with localStorage

## Currency Support

### Supported Currencies
- USD (US Dollar) - Base currency
- EUR (Euro) 
- GBP (British Pound)
- JPY (Japanese Yen)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- CHF (Swiss Franc)
- CNY (Chinese Yuan)
- SEK (Swedish Krona)
- NOK (Norwegian Krone)
- SAR (Saudi Riyal)
- AED (UAE Dirham)

### Features
- **Live Exchange Rates**: Fetched from external APIs every 5 minutes
- **Offline Fallback**: Cached rates used when APIs are unavailable
- **Proper Formatting**: Locale-aware currency formatting with appropriate decimals
- **Real-time Conversion**: All monetary values update when currency is changed

### Usage

```typescript
import { useCurrencyUnit } from '../contexts/CurrencyUnitContext';

const MyComponent = () => {
  const { formatCurrency, convertCurrency } = useCurrencyUnit();
  
  // Format amount in selected currency
  const formattedPrice = formatCurrency(2500); // "$2,500.00"
  
  // Convert from USD to selected currency
  const convertedAmount = convertCurrency(100, 'USD'); // 85 (if EUR selected)
};
```

## Unit Support

### Supported Unit Systems
- **Imperial/US**: PSI, °F, inches, gallons, GPM
- **Metric**: bar, °C, millimeters, liters, L/min  
- **SI**: Pascal, Kelvin, meters, m³, m³/s

### Unit Categories
- **Pressure**: PSI, bar, Pa, kPa, MPa, atm
- **Temperature**: °C, °F, K
- **Length**: in, mm, cm, m, ft
- **Volume**: L, gal, m³, ft³
- **Flow**: GPM, LPM, m³/s, m³/h

### Features
- **Smart Conversion**: Accurate conversion between all units
- **Temperature Handling**: Special logic for Celsius/Fahrenheit/Kelvin
- **Precision Control**: Appropriate decimal places per unit type
- **Valve Specifications**: Convert complete valve spec sets between systems

### Usage

```typescript
import { useCurrencyUnit } from '../contexts/CurrencyUnitContext';

const ValveComponent = () => {
  const { currentUnitSystem, formatUnitValue } = useCurrencyUnit();
  
  // Format value with units
  const pressure = formatUnitValue(1500, currentUnitSystem.units.pressure); // "1500 psi"
  const diameter = formatUnitValue(6, currentUnitSystem.units.length); // "6.00 in"
};
```

## Services

### CurrencyService
- **Rate Management**: Fetches and caches exchange rates
- **Conversion Logic**: Converts between any supported currencies
- **Formatting**: Locale-aware currency formatting
- **Status Monitoring**: Tracks online/offline status

### UnitService  
- **Conversion Engine**: Converts between units of same category
- **System Conversion**: Convert entire unit systems for valve specs
- **Validation**: Checks if conversions are possible
- **Precision Handling**: Appropriate significant figures per unit type

## Testing

Comprehensive test coverage includes:
- **33 unit tests** covering all conversion scenarios
- **Edge cases**: Zero values, invalid currencies, boundary conditions
- **Temperature conversions**: Celsius/Fahrenheit/Kelvin accuracy
- **Currency formatting**: Proper decimals and symbols
- **Unit validation**: Conversion compatibility checks

## Architecture

### Global State Management
```typescript
// Provider wraps the entire app
<CurrencyUnitProvider>
  <App />
</CurrencyUnitProvider>

// Access in any component
const { selectedCurrency, selectedUnitSystem } = useCurrencyUnit();
```

### Persistence
- User preferences automatically saved to localStorage
- Restored on application startup
- Graceful fallback to defaults if invalid values stored

## Integration Points

### Dashboard Integration
- Revenue displays in selected currency
- Valve specifications show in selected units
- Real-time updates when preferences change

### PO Forms
- Currency field automatically uses selected currency
- Unit conversions for valve specifications
- Proper formatting in form displays

### API Integration
- External exchange rate APIs with fallback
- Rate caching for offline operation
- Error handling for API failures

## Future Enhancements

1. **UI Selectors**: Complete currency/unit dropdown components
2. **Settings Page**: Dedicated preferences interface
3. **More Currencies**: Additional regional currencies
4. **Rate History**: Historical exchange rate tracking
5. **Custom Units**: User-defined unit conversions
6. **Bulk Operations**: Convert entire datasets

## Error Handling

The system gracefully handles:
- **API failures**: Falls back to cached rates
- **Invalid currencies**: Uses default USD
- **Invalid units**: Returns original values
- **Network issues**: Continues with offline rates
- **Missing data**: Provides sensible defaults

## Performance

- **Lazy loading**: Services initialized only when needed  
- **Caching**: Exchange rates cached for 5-minute intervals
- **Minimal re-renders**: Optimized React Context usage
- **Memory efficient**: Singleton service instances