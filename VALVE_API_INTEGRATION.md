# ValveChain API Integration Documentation

## Overview
The ValveChain Dashboard has been updated to replace hard-coded valve data with a centralized API service and React Context for global state management.

## Architecture Changes

### 1. API Service Layer (`src/services/valveService.ts`)
- **Purpose**: Centralized API calls using axios
- **Features**:
  - Configurable base URL via environment variables
  - Request/response interceptors for error handling
  - Fallback to mock data when API is unavailable
  - Timeout configuration (10 seconds)

### 2. React Context (`src/contexts/ValveContext.tsx`)
- **Purpose**: Global state management for valve data
- **Features**:
  - Manages loading states, error handling, and data caching
  - Provides `useValves` hook for components
  - Automatic data fetching on component mount
  - Refresh functionality for manual data updates

### 3. TypeScript Interfaces (`src/types/valve.ts`)
- **Purpose**: Type safety for valve data structures
- **Includes**:
  - `Valve` interface for individual valve objects
  - `ManufacturerInterval` interface for service intervals
  - `ValveContextType` for context type safety

## API Endpoints

The service is configured to call the following endpoints:

```
GET /valves - Fetch all valve data
GET /manufacturer-intervals - Fetch service interval configurations
```

**Base URL**: `https://api.valvechain.com` (configurable via `REACT_APP_API_BASE_URL`)

## Environment Configuration

Add to `.env` file:
```
REACT_APP_API_BASE_URL=https://your-api-server.com
```

## Usage

### In Components
```typescript
import { useValves } from '../contexts/ValveContext';

const MyComponent = () => {
  const { valves, loading, error, refreshData } = useValves();
  
  if (loading) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;
  
  return (
    <div>
      {valves.map(valve => (
        <div key={valve.id}>{valve.id}</div>
      ))}
    </div>
  );
};
```

### Wrapping the App
```typescript
import { ValveProvider } from './contexts/ValveContext';

function App() {
  return (
    <ValveProvider>
      <YourComponents />
    </ValveProvider>
  );
}
```

## Error Handling

The implementation includes robust error handling:
- API failures gracefully fall back to mock data
- Loading states provide user feedback
- Error messages are displayed when data cannot be loaded
- Network timeouts are handled appropriately

## Mock Data Fallback

When the API is unavailable, the service automatically falls back to mock data:
- 2 sample valves with realistic data
- Manufacturer service intervals for Emerson and Kitz
- Console warnings indicate when mock data is being used

## Benefits

1. **Separation of Concerns**: API logic is centralized in the service layer
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Error Resilience**: Graceful degradation when backend is unavailable
4. **Performance**: React Context prevents unnecessary re-renders
5. **Maintainability**: Easy to extend with additional API endpoints
6. **Testing**: Service layer can be easily mocked for unit tests

## Future Enhancements

- Add caching with timestamps for data freshness
- Implement optimistic updates for better UX
- Add retry logic with exponential backoff
- Support for real-time updates via WebSocket
- Add data pagination for large datasets