/**
 * API Configuration Module
 * 
 * Centralized configuration for all API services to ensure consistency
 * between frontend and backend communication.
 */

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  enableMockData: boolean;
  debugLogging: boolean;
}

export interface ApiEndpoints {
  // Authentication endpoints
  auth: {
    login: string;
    logout: string;
    validate: string;
  };
  
  // Manufacturer endpoints
  manufacturers: {
    list: string;
    validate: string;
    create: string;
    update: string;
  };
  
  // Valve endpoints
  valves: {
    tokenize: string;
    list: string;
    getByStatus: string;
    getByManufacturer: string;
    update: string;
  };
  
  // Dashboard endpoints
  dashboard: {
    stats: string;
    plantData: string;
  };
  
  // Order endpoints
  orders: {
    list: string;
    create: string;
    update: string;
    pending: string;
  };
  
  // Repair endpoints
  repairs: {
    list: string;
    create: string;
    records: string;
    inProgress: string;
  };
  
  // Database endpoints
  database: {
    query: string;
    run: string;
  };
  
  // Health check
  health: string;
}

/**
 * Get API configuration from environment variables
 */
export const getApiConfig = (): ApiConfig => {
  return {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS || '3'),
    enableMockData: process.env.REACT_APP_ENABLE_MOCK_DATA === 'true',
    debugLogging: process.env.REACT_APP_API_DEBUG_LOGGING === 'true',
  };
};

/**
 * Standard API endpoints that match expected backend routes
 */
export const apiEndpoints: ApiEndpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    validate: '/auth/validate',
  },
  
  manufacturers: {
    list: '/manufacturers',
    validate: '/manufacturers/validate',
    create: '/manufacturers',
    update: '/manufacturers',
  },
  
  valves: {
    tokenize: '/valves/tokenize',
    list: '/valves',
    getByStatus: '/valves/status',
    getByManufacturer: '/valves/manufacturer',
    update: '/valves',
  },
  
  dashboard: {
    stats: '/dashboard/stats',
    plantData: '/dashboard/plant',
  },
  
  orders: {
    list: '/orders',
    create: '/orders',
    update: '/orders',
    pending: '/orders/pending',
  },
  
  repairs: {
    list: '/repairs',
    create: '/repairs',
    records: '/repairs/records',
    inProgress: '/repairs/in-progress',
  },
  
  database: {
    query: '/database/query',
    run: '/database/run',
  },
  
  health: '/health',
};

/**
 * Standard API response format expected from backend
 */
export interface StandardApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
  metadata?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

/**
 * Error response format
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

/**
 * Request options with retry and timeout support
 */
export interface ApiRequestOptions extends RequestInit {
  retryAttempts?: number;
  timeout?: number;
  skipRetry?: boolean;
}

/**
 * Validate API configuration
 */
export const validateApiConfig = (config: ApiConfig): string[] => {
  const errors: string[] = [];
  
  if (!config.baseUrl) {
    errors.push('API base URL is required');
  }
  
  if (config.timeout < 1000) {
    errors.push('API timeout should be at least 1000ms');
  }
  
  if (config.retryAttempts < 0 || config.retryAttempts > 5) {
    errors.push('API retry attempts should be between 0 and 5');
  }
  
  try {
    new URL(config.baseUrl);
  } catch {
    errors.push('API base URL is not a valid URL');
  }
  
  return errors;
};

/**
 * Default headers for API requests
 */
export const getDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Add version header if available
  if (process.env.REACT_APP_VERSION) {
    headers['X-Client-Version'] = process.env.REACT_APP_VERSION;
  }
  
  // Add environment header
  if (process.env.REACT_APP_ENVIRONMENT) {
    headers['X-Environment'] = process.env.REACT_APP_ENVIRONMENT;
  }
  
  return headers;
};

export default {
  getApiConfig,
  apiEndpoints,
  validateApiConfig,
  getDefaultHeaders,
};