# Database API Client Module

A TypeScript module that provides an API client interface mimicking a backend `database.js` interface, implemented as HTTP requests to backend API endpoints for database operations.

## Overview

This module allows the frontend to interact with the database via API calls, mirroring the backend's exported interface. It provides `query()` and `run()` functions that match backend signatures but use `fetch()` to communicate with the backend API instead of direct database access.

## Features

- **Backend-compatible interface**: Functions match `query(sql, params)` and `run(sql, params)` signatures
- **TypeScript support**: Full type safety with interfaces for requests, responses, and table data
- **Error handling**: Comprehensive error handling with timeout support
- **Extensible structure**: Easy to expand for specific table operations
- **Environment flexibility**: Configurable for different environments (dev, staging, prod)
- **React integration**: Includes React hooks for database operations

## Installation

The module is located at `src/services/database.ts` and can be imported directly:

```typescript
import { query, run, DatabaseApiClient } from '../services/database';
```

## Basic Usage

### Query Operations (SELECT)

```typescript
// Basic query with named parameters
const users = await query<User>(
  'SELECT * FROM users WHERE role = :role',
  { role: 'admin' }
);
console.log(users.rows); // Array of User objects

// Query with positional parameters
const valves = await query<Valve>(
  'SELECT * FROM valves WHERE type = ? AND manufacturer = ?',
  ['ball', 'Emerson']
);

// Query without parameters
const allManufacturers = await query<Manufacturer>('SELECT * FROM manufacturers');
```

### Run Operations (INSERT/UPDATE/DELETE)

```typescript
// INSERT with named parameters
const insertResult = await run(
  'INSERT INTO users (name, email, role) VALUES (:name, :email, :role)',
  { name: 'John Doe', email: 'john@example.com', role: 'admin' }
);
console.log(insertResult.insertId); // New record ID

// UPDATE operation
const updateResult = await run(
  'UPDATE valves SET status = :status WHERE id = :id',
  { status: 'in_service', id: 123 }
);
console.log(updateResult.rowsAffected); // Number of updated rows

// DELETE operation
const deleteResult = await run(
  'DELETE FROM temp_data WHERE created_at < :cutoffDate',
  { cutoffDate: '2024-01-01' }
);
```

## Configuration

### Default Configuration

The module uses these default settings:

```typescript
{
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}
```

### Custom Configuration

Create a custom database client instance:

```typescript
const customClient = new DatabaseApiClient({
  baseUrl: 'https://api.myapp.com/v1',
  timeout: 60000, // 1 minute
  headers: {
    'Authorization': 'Bearer your-token',
    'X-Client-Version': '2.0.0'
  }
});
```

### Environment Variables

Set these environment variables for different configurations:

```bash
REACT_APP_API_BASE_URL=https://api.myapp.com/v1
REACT_APP_API_TOKEN=your-api-token
REACT_APP_PROD_API_URL=https://prod-api.myapp.com/v1
REACT_APP_STAGING_API_URL=https://staging-api.myapp.com/v1
```

## TypeScript Types

### Core Types

```typescript
// Parameters for SQL queries
type QueryParams = Record<string, any> | any[] | undefined;

// Query result for SELECT operations
interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  fields?: string[];
}

// Run result for INSERT/UPDATE/DELETE operations
interface RunResult {
  success: boolean;
  rowsAffected: number;
  insertId?: number;
  message?: string;
}
```

### Table-Specific Types

The module includes namespaced types for common tables:

```typescript
// Users
Users.User // User interface
Users.getById(id) // Example function signature

// Manufacturers
Manufacturers.Manufacturer // Manufacturer interface
Manufacturers.getAll() // Example function signature

// Valves
Valves.Valve // Valve interface
Valves.getBySerialNumber(serial) // Example function signature

// Orders
Orders.Order // Order interface
Orders.create(orderData) // Example function signature

// Repair Records
RepairRecords.RepairRecord // Repair record interface
RepairRecords.getByValveId(valveId) // Example function signature
```

## Error Handling

The module provides comprehensive error handling:

```typescript
try {
  const result = await query('SELECT * FROM users');
  // Handle success
} catch (error) {
  if (error.message.includes('timeout')) {
    // Handle timeout
  } else if (error.message.includes('HTTP 4')) {
    // Handle client errors
  } else if (error.message.includes('HTTP 5')) {
    // Handle server errors
  } else {
    // Handle other errors
  }
}
```

## React Integration

### Custom Hook

Use the provided `useDatabaseQuery` hook for reactive database queries:

```typescript
import { useDatabaseQuery } from '../examples/database-examples';

const UserList = () => {
  const { data: users, loading, error } = useDatabaseQuery<User>(
    'SELECT * FROM users WHERE is_active = :active',
    { active: true },
    [] // Dependencies array
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.username}</li>
      ))}
    </ul>
  );
};
```

## Extension Points

### Adding New Table Operations

When backend endpoints are created, extend the module by implementing functions in the appropriate namespace:

```typescript
// In the Users namespace
export namespace Users {
  export const getById = async (id: number): Promise<User | null> => {
    const result = await query<User>('SELECT * FROM users WHERE id = :id', { id });
    return result.rows[0] || null;
  };

  export const create = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
    const result = await run(
      'INSERT INTO users (username, email, role) VALUES (:username, :email, :role)',
      userData
    );
    // Return created user or fetch by insertId
  };
}
```

### Adding New Tables

For new tables not covered by existing namespaces:

```typescript
export namespace NewTable {
  export interface NewTableRecord {
    id: number;
    // ... other fields
  }

  export const getAll = async (): Promise<NewTableRecord[]> => {
    const result = await query<NewTableRecord>('SELECT * FROM new_table');
    return result.rows;
  };
}
```

## API Endpoints

The module expects these backend API endpoints:

### POST /api/database/query
For SELECT operations (query function)

**Request:**
```json
{
  "sql": "SELECT * FROM users WHERE id = :userId",
  "params": { "userId": 123 },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": [{ "id": 123, "username": "john", "email": "john@example.com" }],
  "rowCount": 1,
  "message": "Query executed successfully"
}
```

### POST /api/database/run
For INSERT/UPDATE/DELETE operations (run function)

**Request:**
```json
{
  "sql": "INSERT INTO users (username, email) VALUES (:username, :email)",
  "params": { "username": "jane", "email": "jane@example.com" },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "rowCount": 1,
  "insertId": 124,
  "message": "User created successfully"
}
```

## Examples

See `src/examples/database-examples.ts` for comprehensive usage examples including:

- User management operations
- Manufacturer management
- Valve operations
- Complex reporting queries
- Custom client configurations
- React hooks integration
- Error handling patterns
- Transaction-like operations

## Testing

Run the database module tests:

```bash
npm test -- --testPathPattern=database.test.ts
```

The test suite includes:
- Query operation tests
- Run operation tests
- Configuration tests
- Error handling tests
- Mock API response tests

## Performance Considerations

- **Timeout**: All operations have a 30-second default timeout
- **Connection pooling**: Handled by the backend API
- **Caching**: Implement caching strategies in React components as needed
- **Batch operations**: Use `Promise.all()` for parallel operations

## Security

- **SQL Injection**: The module sends SQL and parameters separately to the backend
- **Authentication**: Include authentication tokens in headers
- **HTTPS**: Use HTTPS endpoints in production
- **Environment variables**: Store sensitive configuration in environment variables

## Troubleshooting

### Common Issues

1. **Connection timeout**: Increase timeout or check network connectivity
2. **401 Unauthorized**: Check authentication tokens
3. **404 Not Found**: Verify API endpoint URLs
4. **500 Server Error**: Check backend logs

### Debug Mode

Enable debug logging by setting:
```javascript
process.env.REACT_APP_DEBUG_DATABASE = 'true'
```

## Contributing

When adding new functionality:

1. Follow existing TypeScript patterns
2. Add appropriate error handling
3. Include tests for new functions
4. Update documentation
5. Follow the existing namespace organization

## License

This module is part of the Valve Chain Frontend project.