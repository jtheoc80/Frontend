/**
 * Database API Client Module
 * 
 * This module provides an API client interface that mimics a backend database.js interface
 * but implemented as HTTP requests to backend API endpoints for database operations.
 * 
 * Functions match backend signatures (query(sql, params), run(sql, params)) but use
 * fetch to communicate with the backend API instead of direct database access.
 * 
 * @author Frontend Team
 * @version 1.0.0
 */

// ============================================================================
// TypeScript Types and Interfaces
// ============================================================================

/**
 * Parameters for SQL queries - supports named parameters, positional parameters, or none
 */
export type QueryParams = Record<string, any> | any[] | undefined;

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
  rowCount?: number;
  insertId?: number;
}

/**
 * Configuration for database operations
 */
export interface DatabaseConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

/**
 * Query result interface for SELECT operations
 */
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  fields?: string[];
}

/**
 * Run result interface for INSERT/UPDATE/DELETE operations
 */
export interface RunResult {
  success: boolean;
  rowsAffected: number;
  insertId?: number;
  message?: string;
}

// ============================================================================
// Database API Client Class
// ============================================================================

class DatabaseApiClient {
  private config: DatabaseConfig;

  constructor(config?: Partial<DatabaseConfig>) {
    this.config = {
      baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...config
    };
  }

  /**
   * Execute a SELECT query and return results
   * 
   * @param sql - SQL query string
   * @param params - Query parameters (named object, array, or undefined)
   * @returns Promise<QueryResult<T>> - Query results with rows and metadata
   * 
   * @example
   * ```typescript
   * // Named parameters
   * const users = await query<User>('SELECT * FROM users WHERE id = :userId', { userId: 123 });
   * 
   * // Positional parameters
   * const valves = await query<Valve>('SELECT * FROM valves WHERE type = ? AND manufacturer = ?', ['ball', 'Emerson']);
   * 
   * // No parameters
   * const allManufacturers = await query<Manufacturer>('SELECT * FROM manufacturers');
   * ```
   */
  async query<T = any>(sql: string, params?: QueryParams): Promise<QueryResult<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/database/query`, {
        method: 'POST',
        headers: this.config.headers,
        body: JSON.stringify({
          sql,
          params: params || {},
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<T[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || 'Query execution failed');
      }

      return {
        rows: result.data || [],
        rowCount: result.rowCount || (result.data?.length ?? 0),
        fields: [] // Could be populated by backend if needed
      };

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Query timeout after ${this.config.timeout}ms`);
        }
        throw error;
      }
      throw new Error('Unknown error occurred during query execution');
    }
  }

  /**
   * Execute an INSERT, UPDATE, or DELETE operation
   * 
   * @param sql - SQL statement string
   * @param params - Statement parameters (named object, array, or undefined)
   * @returns Promise<RunResult> - Execution result with affected rows and metadata
   * 
   * @example
   * ```typescript
   * // INSERT with named parameters
   * const insertResult = await run(
   *   'INSERT INTO users (name, email, role) VALUES (:name, :email, :role)',
   *   { name: 'John Doe', email: 'john@example.com', role: 'admin' }
   * );
   * 
   * // UPDATE with positional parameters
   * const updateResult = await run(
   *   'UPDATE valves SET status = ? WHERE id = ?',
   *   ['in_service', 'VLV001']
   * );
   * 
   * // DELETE
   * const deleteResult = await run('DELETE FROM temp_orders WHERE created_at < NOW() - INTERVAL 1 DAY');
   * ```
   */
  async run(sql: string, params?: QueryParams): Promise<RunResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}/database/run`, {
        method: 'POST',
        headers: this.config.headers,
        body: JSON.stringify({
          sql,
          params: params || {},
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || 'Statement execution failed');
      }

      return {
        success: true,
        rowsAffected: result.rowCount || 0,
        insertId: result.insertId,
        message: result.message
      };

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Statement timeout after ${this.config.timeout}ms`);
        }
        throw error;
      }
      throw new Error('Unknown error occurred during statement execution');
    }
  }

  /**
   * Update configuration (useful for changing base URL or headers)
   */
  updateConfig(newConfig: Partial<DatabaseConfig>): void {
    this.config = { 
      ...this.config, 
      ...newConfig,
      // Merge headers properly
      headers: { ...this.config.headers, ...newConfig.headers }
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): DatabaseConfig {
    return { ...this.config };
  }
}

// ============================================================================
// Specific Table Operation Extensions
// ============================================================================

/**
 * Users table operations
 * Extend this section when backend endpoints for users are created
 */
export namespace Users {
  export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'manufacturer' | 'distributor' | 'plant_operator' | 'repair_contractor';
    created_at: string;
    updated_at: string;
    is_active: boolean;
  }

  // Example functions to implement when backend is ready:
  // export const getById = async (id: number): Promise<User | null> => { ... }
  // export const create = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => { ... }
  // export const updateById = async (id: number, updates: Partial<User>): Promise<boolean> => { ... }
  // export const deleteById = async (id: number): Promise<boolean> => { ... }
}

/**
 * Manufacturers table operations
 * Extend this section when backend endpoints for manufacturers are created
 */
export namespace Manufacturers {
  export interface Manufacturer {
    id: number;
    name: string;
    wallet_address: string;
    contact_email: string;
    contact_phone?: string;
    address?: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  }

  // Example functions to implement when backend is ready:
  // export const getAll = async (): Promise<Manufacturer[]> => { ... }
  // export const getByWalletAddress = async (address: string): Promise<Manufacturer | null> => { ... }
  // export const create = async (manufacturerData: Omit<Manufacturer, 'id' | 'created_at' | 'updated_at'>): Promise<Manufacturer> => { ... }
}

/**
 * Valves table operations
 * Extend this section when backend endpoints for valves are created
 */
export namespace Valves {
  export interface Valve {
    id: number;
    serial_number: string;
    token_id?: string;
    manufacturer_id: number;
    valve_type: string;
    model: string;
    specifications: any; // JSON field
    certifications: string[];
    manufacture_date: string;
    warranty_months: number;
    status: string;
    current_owner?: string;
    location?: string;
    created_at: string;
    updated_at: string;
  }

  // Example functions to implement when backend is ready:
  // export const getBySerialNumber = async (serialNumber: string): Promise<Valve | null> => { ... }
  // export const getByManufacturer = async (manufacturerId: number): Promise<Valve[]> => { ... }
  // export const updateStatus = async (id: number, status: string): Promise<boolean> => { ... }
}

/**
 * Orders table operations
 * Extend this section when backend endpoints for orders are created
 */
export namespace Orders {
  export interface Order {
    id: number;
    order_number: string;
    manufacturer_id: number;
    distributor_id: number;
    valve_ids: number[];
    total_amount: number;
    currency: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    order_date: string;
    expected_delivery_date?: string;
    actual_delivery_date?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
  }

  // Example functions to implement when backend is ready:
  // export const create = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> => { ... }
  // export const getByStatus = async (status: Order['status']): Promise<Order[]> => { ... }
  // export const updateStatus = async (id: number, status: Order['status']): Promise<boolean> => { ... }
}

/**
 * Repair Records table operations
 * Extend this section when backend endpoints for repair records are created
 */
export namespace RepairRecords {
  export interface RepairRecord {
    id: number;
    valve_id: number;
    contractor_id: number;
    description: string;
    start_date: string;
    expected_completion_date?: string;
    completion_date?: string;
    status: 'requested' | 'in_progress' | 'completed' | 'cancelled';
    cost?: number;
    created_at: string;
    updated_at: string;
  }

  // Example functions to implement when backend is ready:
  // export const getByValveId = async (valveId: number): Promise<RepairRecord[]> => { ... }
  // export const create = async (repairData: Omit<RepairRecord, 'id' | 'created_at' | 'updated_at'>): Promise<RepairRecord> => { ... }
}

// ============================================================================
// Singleton Instance and Exports
// ============================================================================

/**
 * Default database client instance
 */
export const database = new DatabaseApiClient();

/**
 * Main database functions - these match the backend database.js interface
 */
export const query = database.query.bind(database);
export const run = database.run.bind(database);

/**
 * Alternative: Export the class for custom instances
 */
export { DatabaseApiClient };

/**
 * Export types for external use
 */
export type {
  QueryParams,
  ApiResponse,
  DatabaseConfig,
  QueryResult,
  RunResult
};

// ============================================================================
// Example Usage
// ============================================================================

/*
// Example 1: Basic SELECT query
const getUser = async (userId: number) => {
  try {
    const result = await query<Users.User>(
      'SELECT * FROM users WHERE id = :userId',
      { userId }
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Failed to get user:', error);
    throw error;
  }
};

// Example 2: Complex query with multiple parameters
const searchValves = async (type: string, manufacturerId: number, minPressure: number) => {
  try {
    const result = await query<Valves.Valve>(
      `SELECT v.*, m.name as manufacturer_name 
       FROM valves v 
       JOIN manufacturers m ON v.manufacturer_id = m.id 
       WHERE v.valve_type = :type 
       AND v.manufacturer_id = :manufacturerId 
       AND JSON_EXTRACT(v.specifications, '$.pressure') >= :minPressure
       ORDER BY v.created_at DESC`,
      { type, manufacturerId, minPressure }
    );
    return result.rows;
  } catch (error) {
    console.error('Failed to search valves:', error);
    throw error;
  }
};

// Example 3: INSERT operation
const createManufacturer = async (manufacturerData: Omit<Manufacturers.Manufacturer, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const result = await run(
      `INSERT INTO manufacturers (name, wallet_address, contact_email, contact_phone, address, is_verified)
       VALUES (:name, :wallet_address, :contact_email, :contact_phone, :address, :is_verified)`,
      manufacturerData
    );
    
    if (result.success && result.insertId) {
      console.log(`Manufacturer created with ID: ${result.insertId}`);
      return result.insertId;
    }
    throw new Error('Failed to create manufacturer');
  } catch (error) {
    console.error('Failed to create manufacturer:', error);
    throw error;
  }
};

// Example 4: UPDATE operation
const updateValveStatus = async (valveId: number, newStatus: string, location?: string) => {
  try {
    const updates: any = { status: newStatus, updated_at: new Date().toISOString() };
    if (location) updates.location = location;

    const setParts = Object.keys(updates).map(key => `${key} = :${key}`).join(', ');
    
    const result = await run(
      `UPDATE valves SET ${setParts} WHERE id = :valveId`,
      { ...updates, valveId }
    );
    
    return result.rowsAffected > 0;
  } catch (error) {
    console.error('Failed to update valve status:', error);
    throw error;
  }
};

// Example 5: DELETE operation
const deleteExpiredTokens = async () => {
  try {
    const result = await run(
      `DELETE FROM auth_tokens 
       WHERE expires_at < NOW() 
       OR created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );
    
    console.log(`Deleted ${result.rowsAffected} expired tokens`);
    return result.rowsAffected;
  } catch (error) {
    console.error('Failed to delete expired tokens:', error);
    throw error;
  }
};

// Example 6: Transaction-like operations (when backend supports them)
const transferValveOwnership = async (valveId: number, newOwner: string, transferredBy: string) => {
  try {
    // In a real implementation, this would be wrapped in a database transaction
    
    // Update valve ownership
    await run(
      'UPDATE valves SET current_owner = :newOwner, updated_at = NOW() WHERE id = :valveId',
      { newOwner, valveId }
    );
    
    // Log the ownership transfer
    await run(
      `INSERT INTO ownership_history (valve_id, previous_owner, new_owner, transferred_by, transfer_date)
       SELECT :valveId, current_owner, :newOwner, :transferredBy, NOW()
       FROM valves WHERE id = :valveId`,
      { valveId, newOwner, transferredBy }
    );
    
    console.log(`Valve ${valveId} ownership transferred to ${newOwner}`);
    return true;
  } catch (error) {
    console.error('Failed to transfer valve ownership:', error);
    // In a real transaction, this would rollback automatically
    throw error;
  }
};

// Example 7: Custom configuration
const createCustomDatabaseClient = () => {
  return new DatabaseApiClient({
    baseUrl: 'https://api.valve-chain.com/v1',
    timeout: 60000, // 1 minute timeout
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-api-token',
      'X-Client-Version': '1.0.0'
    }
  });
};
*/