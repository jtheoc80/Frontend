# Quick Setup Guide for Backend Integration

This guide helps backend developers quickly set up and test compatibility with the Frontend application.

## Quick Start

### 1. Environment Configuration

Copy the example environment file and configure for your backend:

```bash
cp .env.example .env
```

Update these key variables in `.env`:

```bash
# Point to your backend API
REACT_APP_API_BASE_URL=http://localhost:3001/api

# Disable mock data to use real backend
REACT_APP_ENABLE_MOCK_DATA=false

# Enable API debugging
REACT_APP_API_DEBUG_LOGGING=true
```

### 2. Test API Compatibility

Run the built-in compatibility checker:

```javascript
// In your browser console or development tools
import { runCompatibilityCheck } from './src/scripts/compatibilityCheck';
await runCompatibilityCheck();
```

### 3. Required Backend Endpoints

Your backend must implement these essential endpoints:

```
GET  /api/health                    # Health check
GET  /api/manufacturers             # List manufacturers
POST /api/manufacturers/validate    # Validate manufacturer
POST /api/valves/tokenize          # Tokenize valve
GET  /api/dashboard/stats          # Dashboard statistics
POST /api/database/query           # Database query
POST /api/database/run             # Database command
```

### 4. Response Format

All API responses should follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "errors": [],
  "metadata": {
    "timestamp": "2024-01-15T10:00:00Z",
    "requestId": "req-12345"
  }
}
```

### 5. Testing

Start your backend server and run:

```bash
npm start
```

Check the browser console for compatibility test results.

## Common Issues

### API Not Responding
- Ensure backend is running on the configured port
- Check CORS configuration
- Verify endpoint paths match expectations

### Authentication Errors
- Implement manufacturer validation endpoint
- Return proper error messages with `success: false`

### Data Format Issues
- Follow the TypeScript interfaces in `src/types/`
- Use the standard response format shown above

## Need Help?

- See full documentation: [BACKEND_COMPATIBILITY.md](./BACKEND_COMPATIBILITY.md)
- Check API endpoint definitions: `src/config/api.ts`
- Review type definitions: `src/types/valve.ts` and `src/types/po.ts`