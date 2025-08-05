/**
 * Database API Client Tests
 * Tests for the database.ts module
 */

import { query, run, DatabaseApiClient } from '../services/database';

// Mock fetch for testing
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Database API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('query function', () => {
    test('should execute SELECT query successfully', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1, name: 'Test User', email: 'test@example.com' }],
        rowCount: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await query('SELECT * FROM users WHERE id = :id', { id: 1 });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/database/query',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
          body: expect.stringContaining('"sql":"SELECT * FROM users WHERE id = :id"'),
        })
      );

      expect(result.rows).toEqual(mockResponse.data);
      expect(result.rowCount).toBe(1);
    });

    test('should handle query errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid SQL syntax' }),
      } as Response);

      await expect(query('INVALID SQL')).rejects.toThrow('Invalid SQL syntax');
    });

    test('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(query('SELECT * FROM users')).rejects.toThrow('Network error');
    });
  });

  describe('run function', () => {
    test('should execute INSERT statement successfully', async () => {
      const mockResponse = {
        success: true,
        rowCount: 1,
        insertId: 123,
        message: 'User created successfully'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await run(
        'INSERT INTO users (name, email) VALUES (:name, :email)',
        { name: 'John Doe', email: 'john@example.com' }
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/database/run',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
          body: expect.stringContaining('"sql":"INSERT INTO users (name, email) VALUES (:name, :email)"'),
        })
      );

      expect(result.success).toBe(true);
      expect(result.rowsAffected).toBe(1);
      expect(result.insertId).toBe(123);
      expect(result.message).toBe('User created successfully');
    });

    test('should execute UPDATE statement successfully', async () => {
      const mockResponse = {
        success: true,
        rowCount: 2,
        message: 'Users updated successfully'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await run(
        'UPDATE users SET status = :status WHERE role = :role',
        { status: 'active', role: 'admin' }
      );

      expect(result.success).toBe(true);
      expect(result.rowsAffected).toBe(2);
      expect(result.message).toBe('Users updated successfully');
    });

    test('should handle run statement errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Database connection failed' }),
      } as Response);

      await expect(run('INSERT INTO invalid_table VALUES (1)')).rejects.toThrow('Database connection failed');
    });
  });

  describe('DatabaseApiClient class', () => {
    test('should create instance with custom config', () => {
      const client = new DatabaseApiClient({
        baseUrl: 'https://custom-api.com/v1',
        timeout: 60000,
        headers: { 'Authorization': 'Bearer token123' }
      });

      const config = client.getConfig();
      expect(config.baseUrl).toBe('https://custom-api.com/v1');
      expect(config.timeout).toBe(60000);
      expect(config.headers.Authorization).toBe('Bearer token123');
    });

    test('should update configuration', () => {
      const client = new DatabaseApiClient();
      
      client.updateConfig({
        baseUrl: 'https://updated-api.com',
        headers: { 'X-Custom-Header': 'value' }
      });

      const config = client.getConfig();
      expect(config.baseUrl).toBe('https://updated-api.com');
      expect(config.headers['X-Custom-Header']).toBe('value');
      expect(config.headers['Content-Type']).toBe('application/json'); // Should preserve existing headers
    });
  });

  describe('configuration', () => {
    test('should have default timeout configuration', () => {
      const client = new DatabaseApiClient();
      const config = client.getConfig();
      
      expect(config.timeout).toBe(30000); // 30 seconds default
      expect(config.baseUrl).toBe('http://localhost:3001/api');
      expect(config.headers['Content-Type']).toBe('application/json');
    });
  });
});