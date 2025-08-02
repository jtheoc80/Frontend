# ValveChain Dashboard

A modern React/TypeScript web application for managing industrial valve inventory, repairs, and maintenance tracking. Built with blockchain integration capabilities for secure and transparent valve lifecycle management.

## Project Overview

ValveChain Dashboard is a comprehensive valve management system designed for industrial plants and maintenance teams. It provides real-time tracking of valve status, maintenance schedules, repair workflows, and payment management.

### Key Features

- **Valve Inventory Management**: Track valve specifications, locations, and operational status
- **Maintenance Scheduling**: Automated service interval calculations based on manufacturer recommendations and plant overrides
- **Repair Workflow**: Manage repair vendor assignments and track repair status
- **Payment Tracking**: Handle maintenance and repair cost management
- **Role-based Access**: Admin and operator role support
- **Responsive Design**: Mobile-first interface built with Chakra UI

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Chakra UI v3 with Ark UI components
- **Styling**: Emotion CSS-in-JS
- **Date Handling**: Day.js
- **Blockchain**: Ethers.js for Web3 integration
- **Testing**: Jest + React Testing Library
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Modern web browser with ES6+ support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jtheoc80/Frontend.git
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Backend Connection

### API Configuration

The frontend is designed to connect to a backend API for data persistence and blockchain operations. Configure the backend connection by setting environment variables:

```bash
# .env.local (create this file in the project root)
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_BLOCKCHAIN_NETWORK=localhost
REACT_APP_CONTRACT_ADDRESS=0x...
```

### Backend Requirements

The backend should provide the following API endpoints:

#### Valve Management
- `GET /api/valves` - Retrieve all valves
- `POST /api/valves` - Create new valve record
- `PUT /api/valves/:id` - Update valve information
- `DELETE /api/valves/:id` - Remove valve record

#### Maintenance & Repairs
- `GET /api/maintenance/:valveId` - Get maintenance history
- `POST /api/maintenance` - Schedule new maintenance
- `GET /api/repairs` - List repair requests
- `POST /api/repairs` - Create repair request
- `PUT /api/repairs/:id` - Update repair status

#### Payments
- `GET /api/payments` - Retrieve payment records
- `POST /api/payments` - Process payment
- `GET /api/invoices/:vendorId` - Get vendor invoices

### Blockchain Integration

For blockchain features, ensure your backend supports:

- Web3 wallet connection (MetaMask, WalletConnect)
- Smart contract interaction for valve registration
- Transaction signing for maintenance records
- IPFS integration for document storage

### Authentication

Configure authentication by implementing these endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

## Testing

The application includes comprehensive unit tests using React Testing Library and Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Test Coverage

- **Component Tests**: StatCard, ValveTable components
- **Integration Tests**: App navigation and dashboard functionality  
- **Helper Function Tests**: Date calculations, status logic, interval management

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Valvetable.tsx  # Main valve inventory table
│   └── *.test.js       # Component tests
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── theme.ts            # Chakra UI theme configuration
└── __tests__/          # Test utilities and mocks
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes with appropriate tests
3. Ensure all tests pass: `npm test`
4. Build successfully: `npm run build`
5. Submit a pull request

## Deployment

Build the application for production:

```bash
npm run build
```

The build folder contains the optimized production files ready for deployment to any static hosting service (Netlify, Vercel, AWS S3, etc.).

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the development team or create an issue in the repository.
