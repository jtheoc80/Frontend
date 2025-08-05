# Valve Chain Frontend Application

This project is a React frontend application for managing valve supply chain operations through blockchain-based Purchase Orders (POs). It provides comprehensive tools for creating, managing, and tracking purchase orders across different stages of the valve supply chain.

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

### Production Build
```bash
npm run build
```

### Environment-specific Builds
- **Development**: Local testing with mock data
- **Staging**: Testnet integration
- **Production**: Mainnet deployment

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
