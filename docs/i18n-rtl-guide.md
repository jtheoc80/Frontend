# Internationalization (i18n) and RTL Support Documentation

## Overview

The ValveChain frontend application now supports internationalization (i18n) and right-to-left (RTL) languages for Middle Eastern market expansion. This implementation uses React-i18next for translation management and includes full RTL layout support.

## Features

- ✅ **Multi-language Support**: English (en) and Arabic (ar) translations
- ✅ **RTL Layout**: Automatic layout direction switching for RTL languages
- ✅ **Language Switcher**: Easy language switching in the dashboard header
- ✅ **Persistent Language**: Language preference saved in localStorage
- ✅ **Document Direction**: Automatic HTML dir attribute management
- ✅ **Responsive Design**: RTL support works across all screen sizes

## Supported Languages

| Language | Code | Direction | Status |
|----------|------|-----------|---------|
| English  | `en` | LTR       | ✅ Complete |
| Arabic   | `ar` | RTL       | ✅ Complete |

## File Structure

```
src/
├── i18n.ts                    # i18n configuration
├── rtl.css                    # RTL-specific styles
├── locales/
│   ├── en/
│   │   └── common.json        # English translations
│   └── ar/
│       └── common.json        # Arabic translations
└── components/
    └── LanguageSwitcher/      # Language switching component
```

## Translation Files

### English (`src/locales/en/common.json`)
```json
{
  "navigation": {
    "about": "About",
    "signIn": "Sign In",
    "getStarted": "Get Started",
    ...
  },
  "dashboard": {
    "title": "ValveChain Dashboard",
    "manufacturerDashboard": "Manufacturer Dashboard",
    ...
  }
}
```

### Arabic (`src/locales/ar/common.json`)
```json
{
  "navigation": {
    "about": "حول",
    "signIn": "تسجيل الدخول", 
    "getStarted": "ابدأ الآن",
    ...
  },
  "dashboard": {
    "title": "لوحة تحكم سلسلة الصمامات",
    "manufacturerDashboard": "لوحة تحكم المصنع",
    ...
  }
}
```

## Usage in Components

### Basic Translation Usage

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button>{t('navigation.getStarted')}</button>
    </div>
  );
};
```

### Language Switching

The language switcher is built into the dashboard header and allows users to switch between English and Arabic. The selected language is automatically saved to localStorage.

### RTL Support

RTL support is automatically handled:

```tsx
import { getTextDirection, isRTL } from '../i18n';

// Automatic direction setting
useEffect(() => {
  document.documentElement.dir = getTextDirection();
  document.documentElement.lang = i18n.language;
}, [i18n.language]);
```

## RTL Styling

Custom CSS classes and properties support RTL layouts:

```css
/* Automatic RTL support */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .dashboard-nav {
  flex-direction: row-reverse;
}

/* CSS Custom Properties */
:root {
  --text-align-start: left;
  --text-align-end: right;
}

[dir="rtl"] {
  --text-align-start: right;
  --text-align-end: left;
}
```

## Adding New Languages

### 1. Add Translation File

Create a new translation file in `src/locales/{language-code}/common.json`:

```json
{
  "navigation": {
    "about": "À propos",
    "signIn": "Se connecter",
    "getStarted": "Commencer"
  }
}
```

### 2. Update i18n Configuration

Add the new language to `src/i18n.ts`:

```typescript
// Import the new translation
import frCommon from './locales/fr/common.json';

const resources = {
  en: { common: enTranslations },
  ar: { common: arTranslations },
  fr: { common: frCommon }, // Add new language
};

// If RTL, add to RTL_LANGUAGES array
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi'];
```

### 3. Update Language Switcher

Add the new language option to the language switcher in `App.tsx`:

```typescript
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // Add new language
];
```

## Translation Keys Structure

### Navigation Keys
- `navigation.about` - About link
- `navigation.signIn` - Sign in button
- `navigation.getStarted` - Get started button
- `navigation.gettingStarted` - Getting started link
- `navigation.manufacturer` - Manufacturer tab
- `navigation.distributor` - Distributor tab
- `navigation.plant` - Plant tab
- `navigation.repair` - Repair tab
- `navigation.valveInventory` - Valve inventory tab
- `navigation.history` - History tab

### Dashboard Keys
- `dashboard.title` - Main dashboard title
- `dashboard.manufacturerDashboard` - Manufacturer dashboard title
- `dashboard.distributorDashboard` - Distributor dashboard title
- `dashboard.plantDashboard` - Plant dashboard title
- `dashboard.repairDashboard` - Repair dashboard title

### Stats Keys
- `stats.totalValves` - Total valves stat
- `stats.pendingTokenization` - Pending tokenization stat
- `stats.inService` - In service stat
- `stats.pendingOrders` - Pending orders stat
- `stats.activeContracts` - Active contracts stat
- `stats.completedJobs` - Completed jobs stat
- `stats.revenue` - Revenue stat

### Landing Page Keys
- `landing.title` - Landing page title
- `landing.hero.title` - Hero section title
- `landing.hero.subtitle` - Hero section subtitle
- `landing.hero.getStarted` - Hero get started button
- `landing.hero.learnMore` - Hero learn more button

### Common Keys
- `common.loading` - Loading message
- `common.error` - Error message
- `common.success` - Success message
- `common.comingSoon` - Coming soon message
- `common.language` - Language label

## Best Practices

### 1. Use Nested Keys
```typescript
// Good
t('dashboard.title')
t('navigation.signIn')

// Avoid
t('dashboardTitle')
t('signInButton')
```

### 2. Consistent Naming
- Use camelCase for keys
- Group related translations under common prefixes
- Use descriptive key names

### 3. Handle Missing Translations
```typescript
// Provide fallbacks
t('missing.key', 'Default text')

// Use fallback namespace
t('key', { ns: 'fallback' })
```

### 4. RTL-Aware Styling
```css
/* Use logical properties */
margin-inline-start: 1rem;
padding-inline-end: 0.5rem;
border-inline-start: 1px solid #ccc;

/* Or conditional classes */
.rtl-aware {
  margin-left: 1rem;
}

[dir="rtl"] .rtl-aware {
  margin-left: 0;
  margin-right: 1rem;
}
```

## Testing

### Manual Testing
1. Switch to Arabic language
2. Verify all text is translated
3. Check RTL layout is applied correctly
4. Test on different screen sizes
5. Verify language persistence after refresh

### Component Testing
```typescript
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const renderWithI18n = (component) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};
```

## Browser Support

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+

## Performance Considerations

- Translation files are bundled at build time
- Language switching is instant (no network requests)
- localStorage is used for persistence
- RTL styles are loaded conditionally

## Troubleshooting

### Language Not Switching
- Check browser console for i18next errors
- Verify translation keys exist in both languages
- Clear localStorage if needed

### RTL Layout Issues
- Check if RTL CSS is loaded
- Verify `[dir="rtl"]` selectors
- Use browser dev tools to inspect direction attribute

### Missing Translations
- Check translation file syntax
- Verify key paths match component usage
- Enable debug mode in i18n config

## Future Enhancements

- [ ] **Additional Languages**: French, German, Spanish, Chinese
- [ ] **Plural Forms**: Support for complex plural rules
- [ ] **Context**: Context-aware translations
- [ ] **Namespaces**: Split translations into multiple files
- [ ] **Dynamic Loading**: Load translations on demand
- [ ] **Translation Management**: Integration with translation services
- [ ] **Number/Date Formatting**: Locale-aware formatting
- [ ] **Currency Support**: Multi-currency display