/**
 * Database API Client Usage Examples
 * 
 * This file demonstrates how to use the database.ts module
 * in a real React application scenario.
 */

import { query, run, DatabaseApiClient } from '../services/database';
import type { Users, Manufacturers, Valves } from '../services/database';

// ============================================================================
// Example 1: User Management
// ============================================================================

export const UserService = {
  async getById(userId: number): Promise<Users.User | null> {
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
  },

  async create(userData: Omit<Users.User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    try {
      const result = await run(
        `INSERT INTO users (username, email, role, is_active) 
         VALUES (:username, :email, :role, :is_active)`,
        userData
      );
      
      if (result.success && result.insertId) {
        return result.insertId;
      }
      throw new Error('Failed to create user');
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  async updateRole(userId: number, newRole: Users.User['role']): Promise<boolean> {
    try {
      const result = await run(
        'UPDATE users SET role = :role, updated_at = NOW() WHERE id = :userId',
        { userId, role: newRole }
      );
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw error;
    }
  }
};

// ============================================================================
// Example 2: Manufacturer Management
// ============================================================================

export const ManufacturerService = {
  async getAll(): Promise<Manufacturers.Manufacturer[]> {
    try {
      const result = await query<Manufacturers.Manufacturer>(
        'SELECT * FROM manufacturers WHERE is_verified = true ORDER BY name'
      );
      return result.rows;
    } catch (error) {
      console.error('Failed to get manufacturers:', error);
      throw error;
    }
  },

  async getByWalletAddress(walletAddress: string): Promise<Manufacturers.Manufacturer | null> {
    try {
      const result = await query<Manufacturers.Manufacturer>(
        'SELECT * FROM manufacturers WHERE wallet_address = :walletAddress',
        { walletAddress }
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Failed to get manufacturer by wallet:', error);
      throw error;
    }
  },

  async verify(manufacturerId: number): Promise<boolean> {
    try {
      const result = await run(
        'UPDATE manufacturers SET is_verified = true, updated_at = NOW() WHERE id = :manufacturerId',
        { manufacturerId }
      );
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Failed to verify manufacturer:', error);
      throw error;
    }
  }
};

// ============================================================================
// Example 3: Valve Management
// ============================================================================

export const ValveService = {
  async getBySerialNumber(serialNumber: string): Promise<Valves.Valve | null> {
    try {
      const result = await query<Valves.Valve>(
        'SELECT * FROM valves WHERE serial_number = :serialNumber',
        { serialNumber }
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Failed to get valve by serial number:', error);
      throw error;
    }
  },

  async searchByManufacturer(manufacturerId: number, valveType?: string): Promise<Valves.Valve[]> {
    try {
      let sql = `
        SELECT v.*, m.name as manufacturer_name 
        FROM valves v 
        JOIN manufacturers m ON v.manufacturer_id = m.id 
        WHERE v.manufacturer_id = :manufacturerId
      `;
      const params: any = { manufacturerId };

      if (valveType) {
        sql += ' AND v.valve_type = :valveType';
        params.valveType = valveType;
      }

      sql += ' ORDER BY v.created_at DESC';

      const result = await query<Valves.Valve>(sql, params);
      return result.rows;
    } catch (error) {
      console.error('Failed to search valves:', error);
      throw error;
    }
  },

  async updateStatus(valveId: number, newStatus: string, location?: string): Promise<boolean> {
    try {
      const updates: any = { 
        status: newStatus, 
        updated_at: new Date().toISOString(),
        valveId 
      };
      
      if (location) {
        updates.location = location;
      }

      const setParts = Object.keys(updates)
        .filter(key => key !== 'valveId')
        .map(key => `${key} = :${key}`)
        .join(', ');
      
      const result = await run(
        `UPDATE valves SET ${setParts} WHERE id = :valveId`,
        updates
      );
      
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Failed to update valve status:', error);
      throw error;
    }
  }
};

// ============================================================================
// Example 4: Complex Queries and Reporting
// ============================================================================

export const ReportService = {
  async getDashboardStats(): Promise<{
    totalValves: number;
    activeValves: number;
    pendingOrders: number;
    verifiedManufacturers: number;
  }> {
    try {
      const [valveStats, orderStats, manufacturerStats] = await Promise.all([
        query(`
          SELECT 
            COUNT(*) as total_valves,
            COUNT(CASE WHEN status = 'in_service' THEN 1 END) as active_valves
          FROM valves
        `),
        query(`
          SELECT COUNT(*) as pending_orders 
          FROM orders 
          WHERE status = 'pending'
        `),
        query(`
          SELECT COUNT(*) as verified_manufacturers 
          FROM manufacturers 
          WHERE is_verified = true
        `)
      ]);

      return {
        totalValves: valveStats.rows[0]?.total_valves || 0,
        activeValves: valveStats.rows[0]?.active_valves || 0,
        pendingOrders: orderStats.rows[0]?.pending_orders || 0,
        verifiedManufacturers: manufacturerStats.rows[0]?.verified_manufacturers || 0
      };
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      throw error;
    }
  },

  async getValvesByManufacturerReport(): Promise<Array<{
    manufacturer_name: string;
    total_valves: number;
    in_service: number;
    in_repair: number;
  }>> {
    try {
      const result = await query(`
        SELECT 
          m.name as manufacturer_name,
          COUNT(v.id) as total_valves,
          COUNT(CASE WHEN v.status = 'in_service' THEN 1 END) as in_service,
          COUNT(CASE WHEN v.status = 'in_repair' THEN 1 END) as in_repair
        FROM manufacturers m
        LEFT JOIN valves v ON m.id = v.manufacturer_id
        WHERE m.is_verified = true
        GROUP BY m.id, m.name
        ORDER BY total_valves DESC
      `);
      return result.rows;
    } catch (error) {
      console.error('Failed to get valves by manufacturer report:', error);
      throw error;
    }
  }
};

// ============================================================================
// Example 5: Custom Database Client for Different Environments
// ============================================================================

export const createProductionDatabaseClient = () => {
  return new DatabaseApiClient({
    baseUrl: process.env.REACT_APP_PROD_API_URL || 'https://api.valve-chain.com/v1',
    timeout: 60000, // 1 minute timeout for production
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
      'X-Client-Version': '1.0.0',
      'X-Client-Name': 'valve-chain-frontend'
    }
  });
};

export const createStagingDatabaseClient = () => {
  return new DatabaseApiClient({
    baseUrl: process.env.REACT_APP_STAGING_API_URL || 'https://staging-api.valve-chain.com/v1',
    timeout: 45000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_STAGING_API_TOKEN}`,
      'X-Environment': 'staging'
    }
  });
};

// ============================================================================
// Example 6: React Hook for Database Operations
// ============================================================================

import { useState, useEffect } from 'react';

export const useDatabaseQuery = <T>(sql: string, params?: any, dependencies: any[] = []) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const executeQuery = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await query<T>(sql, params);
        setData(result.rows);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    executeQuery();
  }, dependencies);

  return { data, loading, error };
};

// Example usage of the hook in a React component:
/*
export const UserListComponent = () => {
  const { data: users, loading, error } = useDatabaseQuery<Users.User>(
    'SELECT * FROM users WHERE is_active = :isActive ORDER BY username',
    { isActive: true },
    [] // No dependencies, so query runs once on mount
  );

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.username} ({user.role})</li>
      ))}
    </ul>
  );
};
*/

// ============================================================================
// Example 7: Error Handling Patterns
// ============================================================================

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`${operationName} failed:`, error);
    
    // You could send to error reporting service here
    // errorReportingService.captureException(error, { operation: operationName });
    
    // You could show user-friendly error messages here
    // notificationService.showError(`Failed to ${operationName.toLowerCase()}`);
    
    return null;
  }
};

// Usage example:
export const getUserSafely = async (userId: number): Promise<Users.User | null> => {
  return withErrorHandling(
    () => UserService.getById(userId),
    'Get User'
  );
};

// ============================================================================
// Example 8: Transaction-like Operations
// ============================================================================

export const ValveTransferService = {
  async transferOwnership(
    valveId: number, 
    newOwner: string, 
    transferredBy: string
  ): Promise<boolean> {
    try {
      // In a real backend with transactions, these would be atomic
      // For now, we'll do them sequentially and handle errors
      
      // 1. Update valve ownership
      const updateResult = await run(
        'UPDATE valves SET current_owner = :newOwner, updated_at = NOW() WHERE id = :valveId',
        { newOwner, valveId }
      );
      
      if (!updateResult.success || updateResult.rowsAffected === 0) {
        throw new Error('Failed to update valve ownership');
      }
      
      // 2. Log the ownership transfer
      const logResult = await run(
        `INSERT INTO ownership_history (valve_id, new_owner, transferred_by, transfer_date)
         VALUES (:valveId, :newOwner, :transferredBy, NOW())`,
        { valveId, newOwner, transferredBy }
      );
      
      if (!logResult.success) {
        // In a real transaction, this would rollback automatically
        console.warn('Failed to log ownership transfer, but valve was updated');
      }
      
      console.log(`Valve ${valveId} ownership transferred to ${newOwner}`);
      return true;
      
    } catch (error) {
      console.error('Failed to transfer valve ownership:', error);
      // In a real transaction system, rollback would happen automatically
      throw error;
    }
  }
};

export default {
  UserService,
  ManufacturerService,
  ValveService,
  ReportService,
  ValveTransferService
};