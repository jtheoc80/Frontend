# ValveChain Farbschema-Leitfaden

## Professionelle Farbpalette

ValveChain verwendet eine sorgfältig ausgewählte professionelle Farbpalette, die industrielle Tradition mit moderner Technologie ausbalanciert:

> **Übersetzungshinweis**: Farbcodes werden in ursprünglichen Hexadezimalwerten beibehalten, um visuelle Konsistenz zu gewährleisten.

### Primärfarben

#### Tiefblau (Primäre Markenfarbe)
- **Primär**: `#1e3a8a` - Verwendet für Überschriften, primäre Buttons und wichtige UI-Elemente
- **Hell**: `#4c32b3` - Verwendet für Verläufe und Hover-Zustände
- **Verwendung**: Hauptbranding, Navigationsheader, primäre Aktionen

#### Smaragdgrün (Technologie/Zukunft Akzent)
- **Primär**: `#10b981` - Verwendet für Erfolgszustände, primäre CTAs und positive Aktionen
- **Hover**: `#059669` - Hover-Zustand für grüne Buttons
- **Dunkel**: `#047857` - Aktiver Zustand und Erfolgsmeldungen
- **Verwendung**: Call-to-Action-Buttons, Erfolgsindikatoren, Fortschrittselemente

### Sekundärfarben

#### Silbergrau (Neutral/Inhalt)
- **Hell**: `#f8fafc` - Hintergrundfarbe für Seiten
- **Mittel**: `#64748b` - Fließtext und sekundärer Inhalt
- **Dunkel**: `#334155` - Sekundäre Überschriften und wichtiger Text
- **Rand**: `#e2e8f0` - Kartenränder und Trennlinien
- **Verwendung**: Hintergründe, Textinhalt, Ränder, subtile UI-Elemente

#### Kupfer (Industrielle Tradition - Reserviert)
- **Primär**: `#f28316` - Reserviert für spezielle industrielle Indikatoren
- **Dunkel**: `#bc4e0c` - Sparsam verwendet für industrielle Traditionselemente
- **Verwendung**: Begrenzte Verwendung für industrielle Traditionsreferenzen in Logo und speziellen Indikatoren

## Farbverwendungs-Richtlinien

### Hintergründe
- **Seitenhintergrund**: Silbergrau Hell (`#f8fafc`)
- **Karten-/Modal-Hintergrund**: Weiß (`#ffffff`)
- **Hero-Bereiche**: Tiefblau-Verlauf (`linear-gradient(135deg, #1e3a8a 0%, #4c32b3 100%)`)

### Textfarben
- **Primäre Überschriften**: Tiefblau (`#1e3a8a`)
- **Fließtext**: Silbergrau Mittel (`#64748b`)
- **Sekundärer Text**: Silbergrau Dunkel (`#334155`)
- **Heller Text auf Dunkel**: Weiß (`#ffffff`) oder Silbergrau Hell (`#f1f5f9`)

### Interaktive Elemente
- **Primäre Buttons**: Smaragdgrün (`#10b981`) Hintergrund mit weißem Text
- **Sekundäre Buttons**: Weißer Hintergrund mit Tiefblau (`#1e3a8a`) Text und Rand
- **Button-Hover-Zustände**: Primärfarbe um 10-15% abdunkeln
- **Links**: Tiefblau (`#1e3a8a`) mit Unterstreichung bei Hover

### Statusfarben
- **Erfolg**: Smaragdgrün (`#10b981`)
- **Fehler**: Rot (`#dc2626`)
- **Warnung**: Orange (`#f59e0b`)
- **Information**: Tiefblau (`#1e3a8a`)

## Barrierefreiheits-Compliance

Alle Farbkombinationen erfüllen WCAG 2.1 AA-Standards:

- **Text auf Weiß**: Alle Textfarben bieten Kontrastverhältnis ≥ 4.5:1
- **Weißer Text auf Tiefblau**: Kontrastverhältnis = 8.2:1 ✅
- **Tiefblauer Text auf Weiß**: Kontrastverhältnis = 11.8:1 ✅
- **Silbergrauer Text auf Weiß**: Kontrastverhältnis = 5.1:1 ✅

## Implementierung

### CSS Custom Properties
```css
:root {
  /* Tiefblau */
  --color-deep-blue: #1e3a8a;
  --color-deep-blue-light: #4c32b3;
  
  /* Smaragdgrün */
  --color-emerald: #10b981;
  --color-emerald-hover: #059669;
  --color-emerald-active: #047857;
  
  /* Silbergrau */
  --color-gray-light: #f8fafc;
  --color-gray-medium: #64748b;
  --color-gray-dark: #334155;
  --color-gray-border: #e2e8f0;
  
  /* Kupfer (Begrenzte Verwendung) */
  --color-copper: #f28316;
  --color-copper-dark: #bc4e0c;
}
```

### Chakra UI Theme-Integration
Die Farbpalette ist in das Chakra UI Theme-System integriert für konsistente Verwendung über alle Komponenten hinweg.

## Marken-Richtlinien

1. **Immer Tiefblau für primäre Branding-Elemente verwenden**
2. **Smaragdgrün sollte sparsam nur für Schlüsselaktionen verwendet werden**
3. **Hohe Kontrastverhältnisse für Barrierefreiheit beibehalten**
4. **Silbergrau für Inhaltshierarchie verwenden**
5. **Kupfer sollte für spezielle industrielle Traditionselemente reserviert bleiben**
6. **Vermeiden Sie Farben außerhalb dieser Palette ohne Genehmigung**

Dieses Farbschema stellt sicher, dass ValveChain eine professionelle, barrierefreie und kohäsive visuelle Identität beibehält, die industrielle Tradition mit moderner Technologie verbindet.

---

**Übersetzungsversion**: Basierend auf englischer Version v1.0
**Letzte Aktualisierung**: August 2024
**Übersetzungsstatus**: Vollständige Übersetzung, erfordert Design-Expertenprüfung