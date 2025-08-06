# Valve Chain Frontend Application

This project is a React frontend application for managing valve supply chain operations through blockchain-based Purchase Orders (POs). It provides comprehensive tools for creating, managing, and tracking purchase orders across different stages of the valve supply chain.

## 🌍 Documentation Languages

This documentation is available in multiple languages to serve our global user base:

- **English** (Default) - Complete documentation in this file
- **中文** (Chinese) - [Chinese Documentation](docs/i18n/zh/README.md)
- **Español** (Spanish) - [Spanish Documentation](docs/i18n/es/README.md)  
- **Deutsch** (German) - [German Documentation](docs/i18n/de/README.md)

### Contributing Translations

We welcome contributions to improve and expand our documentation translations:

- **Translation Guidelines**: See [docs/i18n/README.md](docs/i18n/README.md) for detailed guidelines
- **Request New Language**: Open a [Translation Request](https://github.com/jtheoc80/Frontend/issues/new?assignees=&labels=translation%2Cdocumentation%2Clocalization&template=translation-request.md&title=%5BTRANSLATION%5D+Request+for+%5BLANGUAGE%5D+translation) issue
- **Report Translation Issues**: Use our [Translation Update](https://github.com/jtheoc80/Frontend/issues/new?assignees=&labels=translation%2Cdocumentation%2Cupdate&template=translation-update.md&title=%5BTRANSLATION+UPDATE%5D+%5BLANGUAGE%5D+-+%5BDOCUMENT%5D) template
- **Native Speaker Review**: We seek native speakers with technical backgrounds to ensure accuracy

For translation contributions, we particularly value contributors with:
- Native proficiency in the target language
- Technical writing experience
- Knowledge of industrial valve systems or manufacturing processes
- Understanding of blockchain/Web3 terminology

## Features

### ☁️ Cloud-Ready Infrastructure

The application is designed for enterprise-grade cloud deployment with comprehensive infrastructure support:

- **🐳 Containerization**: Docker and Docker Compose with multi-stage builds
- **🚀 CI/CD Pipeline**: GitHub Actions with automated testing, building, and deployment
- **☁️ Multi-Cloud Support**: Ready-to-deploy configurations for AWS, Azure, and Google Cloud
- **🔄 Auto-Scaling**: Kubernetes and cloud-native auto-scaling capabilities
- **📊 Monitoring**: Built-in health checks, logging, and error tracking
- **🔒 Security**: Container vulnerability scanning and security best practices
- **📋 Infrastructure as Code**: Terraform modules for all major cloud providers

### 🌍 Internationalization (i18n) & RTL Support

The application now supports multiple languages and right-to-left (RTL) layouts for Middle Eastern markets:

- **Multi-language Support**: English and Arabic translations with easy language switching
- **RTL Layout**: Full right-to-left layout support for Arabic and other RTL languages  
- **Language Switcher**: Intuitive language selection in the dashboard header
- **Persistent Settings**: Language preference saved and restored automatically
- **Responsive RTL**: RTL support works across all screen sizes and components

![Internationalization Demo](https://github.com/user-attachments/assets/85f2f18c-6c44-45bc-824e-5fd0a5205949)

*Dashboard showing Arabic translation and RTL layout*

### Manufacturer Dashboard Token Ticker

The manufacturer dashboard now includes a real-time token ticker that displays the number of lifetime tokens currently active on the blockchain. The ticker includes:

- **Real-time Updates**: Automatically refreshes every 30 seconds to show current token count
- **Manual Refresh**: Click the refresh button (↻) to update the count immediately  
- **Live Token Count**: Displays the total number of active tokens with thousand separators (e.g., "1,247")
- **Connection Status**: Shows "Demo Mode" indicator when using mock data
- **Loading States**: Visual feedback during refresh operations
- **Error Handling**: Graceful handling of connection issues with retry functionality
- **Responsive Design**: Adapts to different screen sizes while maintaining visibility

The ticker is prominently displayed in the top-right corner of the manufacturer dashboard and automatically increments when new valves are tokenized through the interface.

![Manufacturer Dashboard with Token Ticker](https://github.com/user-attachments/assets/47f9923f-2457-4abb-828b-d15cb25b650d)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
Includes comprehensive component tests and snapshot tests for PO workflow components.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Purchase Order (PO) Workflow

The application supports a comprehensive 3-stage valve supply chain workflow:

### Stage 1: Distribution → Manufacturer
- **Purpose**: Initial inventory orders from distributors to manufacturers
- **Components**: `CreatePOForm`, `POList`
- **Key Features**:
  - Valve specifications (diameter, pressure, temperature, material)
  - Manufacturer certifications tracking
  - Shipping and delivery terms
  - Warranty and payment terms

### Stage 2: Plant → Distribution
- **Purpose**: Requisition of valves from plants to distribution centers
- **Key Features**:
  - Plant-specific requirements
  - Urgency levels (low, medium, high, critical)
  - Project and budget code tracking
  - Application-specific details

### Stage 3: Repair → Plant
- **Purpose**: Repair service invoicing from repair services to plants
- **Key Features**:
  - Service type tracking (maintenance, repair, overhaul, testing, calibration)
  - Labor hours and rates
  - Parts usage tracking
  - Invoice details with tax calculations

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Blockchain Configuration
PO_CONTRACT_ADDRESS=0x...  # Smart contract address for PO management
ETHEREUM_RPC_URL=http://localhost:8545  # Ethereum node URL
CHAIN_ID=1337  # Network chain ID

# Application Configuration
REACT_APP_API_BASE_URL=http://localhost:3001  # Backend API URL
REACT_APP_ENVIRONMENT=development  # Environment (development, staging, production)

# Optional: Wallet Configuration
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_project_id  # WalletConnect project ID
REACT_APP_INFURA_API_KEY=your_infura_key  # Infura API key for production

# Optional: Monitoring and Analytics
REACT_APP_SENTRY_DSN=your_sentry_dsn  # Error tracking
REACT_APP_ANALYTICS_ID=your_analytics_id  # Analytics tracking
```

## PO Component Usage

### CreatePOForm Component

```tsx
import { CreatePOForm } from './components/PO';

const handleSubmit = async (poData) => {
  // Submit PO to blockchain or API
  console.log('Submitting PO:', poData);
};

<CreatePOForm 
  onSubmit={handleSubmit}
  onCancel={() => setShowForm(false)}
  isLoading={false}
/>
```

### POList Component

```tsx
import { POList } from './components/PO';

const handleLoadPOs = async () => {
  // Load POs from API or blockchain
  return fetchPurchaseOrders();
};

const handleViewDetails = (po) => {
  // View PO details
  setSelectedPO(po);
};

const handleDeletePO = async (orderId) => {
  // Delete PO
  await deletePurchaseOrder(orderId);
};

<POList 
  purchaseOrders={pos}
  onLoadPOs={handleLoadPOs}
  onViewDetails={handleViewDetails}
  onDeletePO={handleDeletePO}
  isLoading={loading}
/>
```

## Data Types

The application uses strongly-typed TypeScript interfaces:

- `POStage`: Enum for workflow stages
- `BasePurchaseOrder`: Common PO fields
- `DistributionToManufacturerPO`: Stage 1 specific fields
- `PlantToDistributionPO`: Stage 2 specific fields  
- `RepairToPlantPO`: Stage 3 specific fields
- `CreatePORequest<T>`: API request structure
- `CreatePOResponse`: API response structure

## Internationalization (i18n) Usage

### Adding New Languages

1. **Create Translation File**: Add a new JSON file in `src/locales/{language-code}/common.json`
2. **Update i18n Config**: Import and add the translations to `src/i18n.ts`
3. **Update Language Switcher**: Add the new language option in the component

### Using Translations in Components

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

### RTL Support

RTL layout is automatically applied for Arabic and other RTL languages. Custom RTL styles are available in `src/rtl.css`.

For detailed i18n documentation, see [docs/i18n-rtl-guide.md](docs/i18n-rtl-guide.md).

## Testing

The application includes comprehensive test coverage:

- **Component Tests**: Functional testing of PO components
- **Snapshot Tests**: UI regression testing  
- **Type Tests**: Purchase order data structure validation

Run tests with:
```bash
npm test                           # Run all tests
npm test -- --coverage            # Run with coverage report
npm test -- --testPathPattern=PO  # Run only PO tests
```

## Architecture

### Frontend Structure
```
src/
├── components/
│   └── PO/
│       ├── CreatePOFormSimple.tsx
│       ├── POListSimple.tsx
│       └── index.ts
├── types/
│   ├── po.ts
│   └── valve.ts
├── services/
│   └── valveApi.ts
└── __tests__/
    └── components/
        └── PO/
```

### Blockchain Integration
- Smart contracts for PO management
- Ethereum-based transaction processing
- MetaMask wallet integration
- IPFS for document storage

## Development

### Prerequisites
- Node.js 16+
- npm or yarn
- MetaMask browser extension
- Local Ethereum node (optional)

### Setup
```bash
npm install
cp .env.example .env  # Configure environment variables
npm start
```

### Contributing
1. Follow existing code patterns
2. Add tests for new components
3. Update documentation
4. Ensure TypeScript compliance

## Deployment

### Local Development
```bash
# Traditional development
npm start

# Docker development environment
docker compose --profile dev up frontend-dev

# Production build locally
docker compose up frontend
```

### Cloud Deployment

The application is **cloud-ready** with comprehensive deployment options:

#### 🐳 Containerization
- **Docker**: Multi-stage production build with Nginx
- **Docker Compose**: Development and production environments
- **Health Checks**: Built-in health monitoring endpoints

#### ☁️ Cloud Platforms
- **AWS ECS**: Auto-scaling Fargate deployment with Application Load Balancer
- **Azure App Service**: Container-based hosting with Application Insights
- **Google Cloud Run**: Serverless container platform with global CDN
- **Kubernetes**: Production-ready manifests with auto-scaling

#### 🚀 Quick Deploy Commands
```bash
# Deploy to AWS ECS
./scripts/deploy-aws.sh production

# Deploy to Azure App Service  
./scripts/deploy-azure.sh production

# Deploy to Google Cloud Run
./scripts/deploy-gcp.sh YOUR_PROJECT_ID production

# Deploy to Kubernetes
./scripts/deploy-k8s.sh production
```

#### 📋 Infrastructure as Code
- **Terraform**: Complete infrastructure definitions for AWS, Azure, and GCP
- **Kubernetes**: Production manifests with ConfigMaps, Secrets, and auto-scaling
- **CI/CD**: GitHub Actions workflows with automated testing and deployment

#### 📊 Monitoring & Observability
- Built-in health checks and application metrics
- Error boundary for graceful error handling
- Production logging with external service integration
- Container security scanning in CI/CD pipeline

For detailed deployment instructions, see [CLOUD_DEPLOYMENT.md](CLOUD_DEPLOYMENT.md).

### Environment-specific Builds
- **Development**: Local testing with mock data and hot reloading
- **Staging**: Testnet integration with production-like infrastructure
- **Production**: Mainnet deployment with full monitoring and auto-scaling

## Security Considerations

- All blockchain transactions require user confirmation
- Private keys never stored in application
- Input validation on all form fields
- Secure API communication
- Regular dependency updates

## Learn More

You can learn more about the technologies used:

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Ethereum Development](https://ethereum.org/developers/)
- [Testing Library Documentation](https://testing-library.com/)
