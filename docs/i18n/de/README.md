# Valve Chain Frontend-Anwendung

Dieses Projekt ist eine React-Frontend-Anwendung zur Verwaltung von Ventil-Lieferketten-Operationen durch blockchain-basierte Bestellungen (POs). Es bietet umfassende Tools zum Erstellen, Verwalten und Verfolgen von Bestellungen über verschiedene Stufen der Ventil-Lieferkette.

> **Übersetzungshinweis**: Dieses Dokument ist aus der englischen Version übersetzt. Bei Unklarheiten konsultieren Sie bitte die ursprüngliche englische Dokumentation.

## Funktionen

### Hersteller-Dashboard Token-Ticker

Das Hersteller-Dashboard enthält jetzt einen Echtzeit-Token-Ticker, der die Anzahl der derzeit auf der Blockchain aktiven Lifetime-Token anzeigt. Der Ticker umfasst:

- **Echtzeit-Updates**: Aktualisiert sich automatisch alle 30 Sekunden, um die aktuelle Token-Anzahl zu zeigen
- **Manuelle Aktualisierung**: Klicken Sie auf die Aktualisierungs-Schaltfläche (↻), um die Anzahl sofort zu aktualisieren
- **Live-Token-Anzahl**: Zeigt die Gesamtzahl aktiver Token mit Tausender-Trennzeichen an (z.B. "1.247")
- **Verbindungsstatus**: Zeigt "Demo-Modus"-Indikator bei Verwendung von Mock-Daten
- **Ladezustände**: Visuelles Feedback während Aktualisierungsvorgängen
- **Fehlerbehandlung**: Elegante Behandlung von Verbindungsproblemen mit Wiederholungsfunktionalität
- **Responsives Design**: Passt sich verschiedenen Bildschirmgrößen an und behält die Sichtbarkeit bei

Der Ticker wird prominent in der oberen rechten Ecke des Hersteller-Dashboards angezeigt und erhöht sich automatisch, wenn neue Ventile über die Benutzeroberfläche tokenisiert werden.

## Verfügbare Skripte

Im Projektverzeichnis können Sie ausführen:

### `npm start`

Führt die App im Entwicklungsmodus aus.\
Öffnen Sie [http://localhost:3000](http://localhost:3000), um es in Ihrem Browser anzuzeigen.

Die Seite wird neu geladen, wenn Sie Änderungen vornehmen.\
Sie können auch Lint-Fehler in der Konsole sehen.

### `npm test`

Startet den Test-Runner im interaktiven Watch-Modus.\
Enthält umfassende Komponententests und Snapshot-Tests für PO-Workflow-Komponenten.

### `npm run build`

Erstellt die App für die Produktion im `build`-Ordner.\
Es bündelt React korrekt im Produktionsmodus und optimiert den Build für die beste Leistung.

Der Build ist minifiziert und die Dateinamen enthalten die Hashes.\
Ihre App ist bereit für die Bereitstellung!

## Bestellungs-Workflow (PO)

Die Anwendung unterstützt einen umfassenden 3-stufigen Ventil-Lieferketten-Workflow:

### Stufe 1: Vertrieb → Hersteller
- **Zweck**: Anfängliche Bestandsbestellungen von Händlern an Hersteller
- **Komponenten**: `CreatePOForm`, `POList`
- **Hauptfunktionen**:
  - Ventilspezifikationen (Durchmesser, Druck, Temperatur, Material)
  - Hersteller-Zertifizierungsverfolgung
  - Versand- und Lieferbedingungen
  - Garantie- und Zahlungsbedingungen

### Stufe 2: Werk → Vertrieb
- **Zweck**: Anforderung von Ventilen von Werken an Vertriebszentren
- **Hauptfunktionen**:
  - Werksspezifische Anforderungen
  - Dringlichkeitsstufen (niedrig, mittel, hoch, kritisch)
  - Projekt- und Budgetcode-Verfolgung
  - Anwendungsspezifische Details

### Stufe 3: Reparatur → Werk
- **Zweck**: Reparaturservice-Rechnungsstellung von Reparaturservices an Werke
- **Hauptfunktionen**:
  - Service-Typ-Verfolgung (Wartung, Reparatur, Überholung, Prüfung, Kalibrierung)
  - Arbeitsstunden und -tarife
  - Teile-Nutzungsverfolgung
  - Rechnungsdetails mit Steuerberechnungen

## Umgebungsvariablen

Erstellen Sie eine `.env`-Datei im Stammverzeichnis mit den folgenden Variablen:

```bash
# Blockchain-Konfiguration
PO_CONTRACT_ADDRESS=0x...  # Smart Contract-Adresse für PO-Verwaltung
ETHEREUM_RPC_URL=http://localhost:8545  # Ethereum-Knoten-URL
CHAIN_ID=1337  # Netzwerk-Chain-ID

# Anwendungskonfiguration
REACT_APP_API_BASE_URL=http://localhost:3001  # Backend-API-URL
REACT_APP_ENVIRONMENT=development  # Umgebung (development, staging, production)

# Optional: Wallet-Konfiguration
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_project_id  # WalletConnect-Projekt-ID
REACT_APP_INFURA_API_KEY=your_infura_key  # Infura-API-Schlüssel für Produktion

# Optional: Überwachung und Analytik
REACT_APP_SENTRY_DSN=your_sentry_dsn  # Fehlerverfolgung
REACT_APP_ANALYTICS_ID=your_analytics_id  # Analytik-Verfolgung
```

## Architektur

### Blockchain-Integration
- Smart Contracts für PO-Verwaltung
- Ethereum-basierte Transaktionsverarbeitung
- MetaMask-Wallet-Integration
- IPFS für Dokumentenspeicherung

## Entwicklung

### Voraussetzungen
- Node.js 16+
- npm oder yarn
- MetaMask-Browser-Erweiterung
- Lokaler Ethereum-Knoten (optional)

### Einrichtung
```bash
npm install
cp .env.example .env  # Umgebungsvariablen konfigurieren
npm start
```

### Beitragen
1. Bestehende Code-Muster befolgen
2. Tests für neue Komponenten hinzufügen
3. Dokumentation aktualisieren
4. TypeScript-Konformität sicherstellen

## Bereitstellung

### Produktions-Build
```bash
npm run build
```

### Umgebungsspezifische Builds
- **Entwicklung**: Lokale Tests mit Mock-Daten
- **Staging**: Testnet-Integration
- **Produktion**: Mainnet-Bereitstellung

## Sicherheitsüberlegungen

- Alle Blockchain-Transaktionen erfordern Benutzerbestätigung
- Private Schlüssel werden niemals in der Anwendung gespeichert
- Eingabevalidierung bei allen Formularfeldern
- Sichere API-Kommunikation
- Regelmäßige Abhängigkeits-Updates

## Mehr erfahren

Sie können mehr über die verwendeten Technologien erfahren:

- [React-Dokumentation](https://reactjs.org/)
- [TypeScript-Dokumentation](https://www.typescriptlang.org/)
- [Ethereum-Entwicklung](https://ethereum.org/developers/)
- [Testing Library-Dokumentation](https://testing-library.com/)

---

**Übersetzungsversion**: Basierend auf englischer Version v0.1.0
**Letzte Aktualisierung**: August 2024
**Übersetzungsstatus**: Vollständige Übersetzung, erfordert technische Expertenprüfung