# Frontend-Backend API Compatibility Guide

This document outlines the API endpoints, request/response formats, and data structures expected by the Frontend application for seamless integration with the Backend.

## API Configuration

### Base URL
- **Environment Variable**: `REACT_APP_API_BASE_URL`
- **Default**: `http://localhost:3001/api`
- **Production**: Should be set to your backend API URL (e.g., `https://api.valvechain.com/v1`)

### Request Headers
All API requests include the following headers:
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "X-Client-Version": "0.1.0",
  "X-Environment": "development"
}
```

## Expected API Endpoints

### Health Check
- **Endpoint**: `GET /health`
- **Purpose**: System health monitoring
- **Response**:
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:00:00Z",
    "version": "1.0.0"
  }
}
```

### Manufacturers

#### List Manufacturers
- **Endpoint**: `GET /manufacturers`
- **Response**:
```json
{
  "success": true,
  "message": "Manufacturers retrieved successfully",
  "data": [
    {
      "id": "mfg001",
      "name": "Emerson Process Management",
      "walletAddress": "0x742d35Cc6436C0532925a3b8D0000a5492d95a8b",
      "permissions": ["tokenize_valves", "read_inventory"]
    }
  ]
}
```

#### Validate Manufacturer
- **Endpoint**: `POST /manufacturers/validate`
- **Request**:
```json
{
  "manufacturerId": "mfg001",
  "walletAddress": "0x742d35Cc6436C0532925a3b8D0000a5492d95a8b",
  "timestamp": "2024-01-15T10:00:00Z"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Manufacturer authenticated successfully",
  "data": {
    "id": "mfg001",
    "name": "Emerson Process Management",
    "isAuthenticated": true,
    "walletAddress": "0x742d35Cc6436C0532925a3b8D0000a5492d95a8b",
    "permissions": ["tokenize_valves", "read_inventory"]
  }
}
```

### Valves

#### Tokenize Valve
- **Endpoint**: `POST /valves/tokenize`
- **Request**:
```json
{
  "manufacturerId": "mfg001",
  "valveDetails": {
    "serialNumber": "EMR-2024-001",
    "type": "ball",
    "manufacturer": "Emerson Process Management",
    "model": "Series 2000",
    "specifications": {
      "diameter": 6,
      "pressure": 1500,
      "temperature": 200,
      "material": "Stainless Steel 316",
      "connectionType": "Flanged"
    },
    "certifications": ["API 6D", "ISO 14313"],
    "manufactureDate": "2024-01-15",
    "warrantyMonths": 24
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Valve successfully tokenized",
  "tokenId": "VLV17089471001",
  "transactionHash": "0x1234567890abcdef...",
  "valveId": "EMR-VLV17089471001"
}
```

### Dashboard

#### Get Dashboard Statistics
- **Endpoint**: `GET /dashboard/stats`
- **Response**:
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalValves": 125,
    "pendingTokenization": 5,
    "inService": 98,
    "inRepair": 12,
    "pendingOrders": 8,
    "scheduledMaintenance": 2
  }
}
```

### Database Operations

#### Execute Query
- **Endpoint**: `POST /database/query`
- **Request**:
```json
{
  "sql": "SELECT * FROM valves WHERE manufacturer_id = :manufacturerId",
  "params": {
    "manufacturerId": 1
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Query executed successfully",
  "data": [
    {
      "id": 1,
      "serial_number": "EMR-2024-001",
      "manufacturer_id": 1,
      "valve_type": "ball"
    }
  ],
  "rowCount": 1
}
```

#### Execute Statement (INSERT/UPDATE/DELETE)
- **Endpoint**: `POST /database/run`
- **Request**:
```json
{
  "sql": "UPDATE valves SET status = :status WHERE id = :valveId",
  "params": {
    "status": "in_service",
    "valveId": 1
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Statement executed successfully",
  "rowCount": 1,
  "insertId": null
}
```

## Standard Response Format

All API responses should follow this format:

```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "errors": string[],
  "metadata": {
    "timestamp": string,
    "requestId": string,
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "hasNext": boolean,
      "hasPrev": boolean
    }
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Detailed error message 1",
    "Detailed error message 2"
  ],
  "metadata": {
    "timestamp": "2024-01-15T10:00:00Z",
    "requestId": "req-12345"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity (business logic errors)
- `500` - Internal Server Error

## Data Types

### Valve Types
```typescript
type ValveType = 'gate' | 'ball' | 'globe' | 'butterfly' | 'check' | 'needle' | 'plug';
type ValveStatus = 'pending_tokenization' | 'tokenized' | 'pending_order' | 'ordered' | 
                  'pending_installation' | 'in_service' | 'scheduled_maintenance' | 'in_repair' | 'repaired';
```

### Valve Specifications
```typescript
interface ValveSpecification {
  diameter: number;         // inches
  pressure: number;         // PSI
  temperature: number;      // Fahrenheit
  material: string;         // e.g., "Stainless Steel 316"
  connectionType: string;   // e.g., "Flanged", "Threaded", "Welded"
  flowCoefficient?: number; // Optional Cv value
}
```

## Environment Variables

The frontend expects these environment variables to be configurable:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_API_TIMEOUT=30000
REACT_APP_API_RETRY_ATTEMPTS=3

# Feature Flags
REACT_APP_ENABLE_MOCK_DATA=false  # Set to true for development with mock data
REACT_APP_API_DEBUG_LOGGING=true  # Enable request/response logging

# Application
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

## Mock Data vs Real API

The frontend supports both mock data (for development) and real API integration:

- **Mock Data**: When `REACT_APP_ENABLE_MOCK_DATA=true`, the frontend uses internal mock data
- **Real API**: When `REACT_APP_ENABLE_MOCK_DATA=false`, the frontend makes actual HTTP requests to the backend
- **Fallback**: If real API calls fail and mock data is enabled, the frontend falls back to mock data

## Security Considerations

1. **Authentication**: All manufacturer validation requests should include wallet address verification
2. **Input Validation**: Backend should validate all input parameters, especially SQL queries in database endpoints
3. **Rate Limiting**: Consider implementing rate limiting for API endpoints
4. **CORS**: Configure CORS properly for frontend domain
5. **Request ID**: Include unique request IDs for debugging and audit trails

## Testing

The frontend includes comprehensive tests that can help verify backend compatibility:

```bash
npm test -- --testNamePattern="database"  # Test database API calls
npm test -- --testNamePattern="valve"     # Test valve API calls
```

## Deployment Considerations

1. **Base URL**: Ensure `REACT_APP_API_BASE_URL` points to the correct backend in production
2. **Timeout**: Adjust `REACT_APP_API_TIMEOUT` based on backend response times
3. **Health Checks**: Implement the `/health` endpoint for container orchestration
4. **Monitoring**: Use request IDs for distributed tracing between frontend and backend