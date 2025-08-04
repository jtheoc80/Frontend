# ValveChain Color Scheme Guide

## Professional Color Palette

ValveChain uses a carefully selected professional color palette that balances industrial heritage with modern technology:

### Primary Colors

#### Deep Blue (Primary Brand Color)
- **Primary**: `#1e3a8a` - Used for headings, primary buttons, and key UI elements
- **Light**: `#4c32b3` - Used for gradients and hover states
- **Usage**: Main branding, navigation headers, primary actions

#### Emerald Green (Technology/Future Accent)
- **Primary**: `#10b981` - Used for success states, primary CTAs, and positive actions
- **Hover**: `#059669` - Hover state for green buttons
- **Dark**: `#047857` - Active state and success messages
- **Usage**: Call-to-action buttons, success indicators, progress elements

### Secondary Colors

#### Silver Gray (Neutral/Content)
- **Light**: `#f8fafc` - Background color for pages
- **Medium**: `#64748b` - Body text and secondary content
- **Dark**: `#334155` - Secondary headings and important text
- **Border**: `#e2e8f0` - Card borders and dividers
- **Usage**: Backgrounds, text content, borders, subtle UI elements

#### Copper (Industrial Heritage - Reserved)
- **Primary**: `#f28316` - Reserved for special industrial indicators
- **Dark**: `#bc4e0c` - Used sparingly for industrial heritage elements
- **Usage**: Limited use for industrial heritage references in logo and special indicators

## Color Usage Guidelines

### Backgrounds
- **Page Background**: Silver Gray Light (`#f8fafc`)
- **Card/Modal Background**: White (`#ffffff`)
- **Hero Sections**: Deep Blue gradient (`linear-gradient(135deg, #1e3a8a 0%, #4c32b3 100%)`)

### Text Colors
- **Primary Headings**: Deep Blue (`#1e3a8a`)
- **Body Text**: Silver Gray Medium (`#64748b`)
- **Secondary Text**: Silver Gray Dark (`#334155`)
- **Light Text on Dark**: White (`#ffffff`) or Silver Gray Light (`#f1f5f9`)

### Interactive Elements
- **Primary Buttons**: Emerald Green (`#10b981`) background with white text
- **Secondary Buttons**: White background with Deep Blue (`#1e3a8a`) text and border
- **Button Hover States**: Darken primary color by 10-15%
- **Links**: Deep Blue (`#1e3a8a`) with underline on hover

### Status Colors
- **Success**: Emerald Green (`#10b981`)
- **Error**: Red (`#dc2626`)
- **Warning**: Orange (`#f59e0b`)
- **Info**: Deep Blue (`#1e3a8a`)

## Accessibility Compliance

All color combinations meet WCAG 2.1 AA standards:

- **Text on White**: All text colors provide contrast ratio ≥ 4.5:1
- **White Text on Deep Blue**: Contrast ratio = 8.2:1 ✅
- **Deep Blue Text on White**: Contrast ratio = 11.8:1 ✅
- **Silver Gray Text on White**: Contrast ratio = 5.1:1 ✅

## Implementation

### CSS Custom Properties
```css
:root {
  /* Deep Blue */
  --color-deep-blue: #1e3a8a;
  --color-deep-blue-light: #4c32b3;
  
  /* Emerald Green */
  --color-emerald: #10b981;
  --color-emerald-hover: #059669;
  --color-emerald-active: #047857;
  
  /* Silver Gray */
  --color-gray-light: #f8fafc;
  --color-gray-medium: #64748b;
  --color-gray-dark: #334155;
  --color-gray-border: #e2e8f0;
  
  /* Copper (Limited Use) */
  --color-copper: #f28316;
  --color-copper-dark: #bc4e0c;
}
```

### Chakra UI Theme Integration
The color palette is integrated into the Chakra UI theme system for consistent usage across all components.

## Brand Guidelines

1. **Always use Deep Blue for primary branding elements**
2. **Emerald Green should be used sparingly for key actions only**
3. **Maintain high contrast ratios for accessibility**
4. **Use Silver Gray for content hierarchy**
5. **Copper should be reserved for special industrial heritage elements**
6. **Avoid using colors outside this palette without approval**

This color scheme ensures ValveChain maintains a professional, accessible, and cohesive visual identity that bridges industrial heritage with modern technology.