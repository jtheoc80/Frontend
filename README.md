# ValveChain Dashboard

A React-based frontend application for managing industrial valve inventory, maintenance scheduling, and blockchain-based tracking. This application provides a comprehensive dashboard for valve lifecycle management with smart contract integration and backend API connectivity.

![Dashboard Screenshot](https://github.com/user-attachments/assets/8a198e8c-531e-4cd0-83ba-d00d4cfb6f3c)

## 🚀 Features

- **Dashboard Overview**: Real-time statistics and quick valve summary
- **Valve Inventory Management**: Comprehensive table view with service scheduling
- **Smart Contract Integration**: Ethereum blockchain integration for valve event tracking
- **Backend API Integration**: RESTful API connectivity for data management
- **Role-based Access**: Admin and vendor-specific functionality
- **Responsive Design**: Built with Chakra UI for modern, responsive interfaces

## 📋 Prerequisites

Before setting up the development environment, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Git**
- **MetaMask** browser extension (for smart contract interactions)
- **Backend API server** (running separately)

## 🛠️ Development Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=10000

# Smart Contract Configuration
REACT_APP_CONTRACT_ADDRESS=0xYourContractAddress
REACT_APP_ETHEREUM_NETWORK=localhost:8545

# Application Configuration
REACT_APP_ENVIRONMENT=development
```

### 4. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Valvetable.tsx          # Main valve inventory table
│   ├── Dashboard.tsx           # Dashboard overview component
│   ├── Roles/                  # Role-specific components
│   └── ...
├── component/                  # Additional components
│   ├── ValveHistoryTable.tsx   # Smart contract integrated table
│   ├── APIDocs.tsx            # API documentation component
│   └── ...
├── App.tsx                     # Main application component
├── index.tsx                   # Application entry point
└── theme.ts                    # Chakra UI theme configuration
```

## 📊 Application Tabs and Functionality

### 1. Dashboard Tab (Default)
**Purpose**: Provides an overview of the valve management system

**Features**:
- Welcome message with user role display
- Key performance indicators:
  - Total valve count (250)
  - Valves currently in repair (3)
  - Outstanding payments ($12,500)
- Quick valve summary showing service due dates

![Valve Inventory Screenshot](https://github.com/user-attachments/assets/5f5f36a0-bf59-448c-ab5f-9fb92a3f355b)

### 2. Valve Inventory Tab
**Purpose**: Comprehensive valve management and service scheduling

**Features**:
- Complete valve listing with detailed information:
  - Valve ID and serial numbers
  - Manufacturer and model details
  - Location and current status
  - Service history and next service dates
  - Process conditions and maintenance intervals
- Color-coded status indicators:
  - 🔴 Red: Overdue for service
  - 🟡 Yellow: Due within 30 days
  - 🟢 Green: Service up to date
- Support for both manufacturer-recommended and plant-override intervals

### 3. Repairs Tab
**Purpose**: Manage valve repair processes and vendor interactions

**Current Status**: Coming Soon
**Planned Features**:
- Repair request management
- Vendor assignment and tracking
- Repair status updates
- Cost tracking and approval workflows

### 4. Valve History Tab
**Purpose**: Historical tracking and blockchain-verified valve events

**Current Status**: Coming Soon
**Planned Features**:
- Complete valve lifecycle history
- Blockchain-verified event tracking
- Service record validation
- Compliance reporting

### 5. Payments Tab
**Purpose**: Financial management for valve services and repairs

**Current Status**: Coming Soon
**Planned Features**:
- Invoice management
- Payment tracking
- Vendor payment processing
- Financial reporting

## 🔗 Smart Contract Integration

### Overview
The application integrates with Ethereum smart contracts using the `ethers.js` library for blockchain-based valve tracking and verification.

### Contract Configuration

1. **Install MetaMask**: Ensure MetaMask browser extension is installed and configured
2. **Network Setup**: Configure your Ethereum network in MetaMask
3. **Contract Address**: Update the contract address in your environment variables

### Smart Contract Functions

The application interacts with the following smart contract functions:

```javascript
// Update valve status on blockchain
const transaction = await contract.updateValveStatus(serialNumber, newStatus);

// Record valve events
const result = await contract.recordValveEvent(valveId, eventType, metadata);
```

### Implementation Example

```typescript
import { ethers } from 'ethers';

// Connect to Ethereum network
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Update valve status
const handleUpdateStatus = async (valveId: string, newStatus: string) => {
  try {
    const transaction = await contract.updateValveStatus(valveId, newStatus);
    await transaction.wait();
    console.log('Valve status updated on blockchain');
  } catch (error) {
    console.error('Smart contract interaction failed:', error);
  }
};
```

### Required Contract ABI
Update the `contractABI` in `src/component/ValveHistoryTable.tsx` with your deployed contract's ABI.

## 🌐 Backend API Integration

### API Base Configuration

The application connects to a RESTful backend API for data management. Configure the API base URL in your environment variables:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

### Available API Endpoints

#### Valve Management
- `GET /valve_history` - Retrieve all valve history data
- `POST /record_valve_event` - Record new valve events
- `GET /valve_history_summary` - Get valve summary statistics

#### Vendor Management
- `POST /register_vendor` - Register a new vendor
- `GET /api/vendors` - Retrieve vendor list
- `POST /accept_msa` - Accept Master Service Agreement

#### Authentication & Security
- `POST /api/verify_2fa` - Two-factor authentication verification
- `POST /api/send_verification_email` - Send email verification
- `POST /api/reset_password` - Password reset functionality

#### Audit & Compliance
- `GET /api/audit_logs` - Retrieve audit trail
- `GET /api/compliance_reports` - Generate compliance reports

### API Integration Example

```typescript
// Fetch valve data
const fetchValveData = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/valve_history`);
    const valves = await response.json();
    setValveData(valves);
  } catch (error) {
    console.error('API request failed:', error);
  }
};

// Record valve event
const recordEvent = async (valveId: string, eventData: object) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/record_valve_event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ valveId, ...eventData }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to record event:', error);
  }
};
```

### Error Handling

Implement proper error handling for API requests:

```typescript
const handleApiError = (error: Error) => {
  console.error('API Error:', error);
  // Show user-friendly error message
  toast({
    title: 'API Error',
    description: 'Failed to connect to backend service',
    status: 'error',
    duration: 5000,
  });
};
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Build and Test
```bash
npm run build
npm test -- --coverage
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Static Hosting
The build folder can be deployed to any static hosting service:

```bash
# Example: Using serve for local testing
npm install -g serve
serve -s build
```

### Environment Variables for Production
Ensure all production environment variables are properly configured:

- `REACT_APP_API_BASE_URL`: Production API endpoint
- `REACT_APP_CONTRACT_ADDRESS`: Deployed smart contract address
- `REACT_APP_ETHEREUM_NETWORK`: Production Ethereum network

## 🛠️ Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 🔧 Troubleshooting

### Common Issues

1. **MetaMask Connection Issues**
   - Ensure MetaMask is installed and unlocked
   - Check network configuration
   - Verify contract address is correct

2. **API Connection Failures**
   - Verify backend server is running
   - Check API base URL configuration
   - Ensure CORS is properly configured on backend

3. **Build Failures**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run build`
   - Verify all dependencies are compatible

### Development Tips

- Use React Developer Tools for debugging
- Monitor network requests in browser DevTools
- Check console for error messages
- Use MetaMask's developer mode for blockchain debugging

## 📚 Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Chakra UI documentation](https://chakra-ui.com/)
- [Ethers.js documentation](https://docs.ethers.io/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
