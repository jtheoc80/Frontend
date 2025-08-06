/**
 * API Validation Utilities
 * 
 * Utilities to validate frontend-backend API compatibility
 */

import { getApiConfig, apiEndpoints } from '../config/api';

export interface ApiValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  endpoint?: string;
  responseTime?: number;
}

/**
 * Validate API configuration
 */
export const validateApiConfiguration = (): ApiValidationResult => {
  const config = getApiConfig();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate base URL
  if (!config.baseUrl) {
    errors.push('API base URL is not configured');
  } else {
    try {
      new URL(config.baseUrl);
    } catch {
      errors.push('API base URL is not a valid URL');
    }
  }

  // Validate timeout
  if (config.timeout < 1000) {
    warnings.push('API timeout is less than 1 second, this may cause timeouts');
  } else if (config.timeout > 60000) {
    warnings.push('API timeout is greater than 60 seconds, this may cause poor user experience');
  }

  // Validate retry attempts
  if (config.retryAttempts > 5) {
    warnings.push('Too many retry attempts may cause poor user experience');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Test API endpoint connectivity
 */
export const testApiEndpoint = async (endpoint: string, timeout: number = 5000): Promise<ApiValidationResult> => {
  const config = getApiConfig();
  const url = `${config.baseUrl}${endpoint}`;
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);
    const responseTime = performance.now() - startTime;

    if (!response.ok) {
      errors.push(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (responseTime > 2000) {
      warnings.push(`Slow response time: ${responseTime.toFixed(0)}ms`);
    }

    return {
      isValid: response.ok,
      errors,
      warnings,
      endpoint,
      responseTime
    };

  } catch (error) {
    const responseTime = performance.now() - startTime;
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errors.push(`Request timeout after ${timeout}ms`);
      } else if (error.message.includes('ECONNREFUSED')) {
        errors.push('Connection refused - API server may not be running');
      } else if (error.message.includes('ENOTFOUND')) {
        errors.push('Host not found - check API base URL');
      } else {
        errors.push(`Network error: ${error.message}`);
      }
    } else {
      errors.push('Unknown network error');
    }

    return {
      isValid: false,
      errors,
      warnings,
      endpoint,
      responseTime
    };
  }
};

/**
 * Run comprehensive API compatibility tests
 */
export const runApiCompatibilityTests = async (): Promise<{
  configValidation: ApiValidationResult;
  endpointTests: Record<string, ApiValidationResult>;
  overallValid: boolean;
}> => {
  // Test configuration
  const configValidation = validateApiConfiguration();

  // Test key endpoints
  const endpointTests: Record<string, ApiValidationResult> = {};
  
  if (configValidation.isValid) {
    const keyEndpoints = [
      { name: 'health', endpoint: apiEndpoints.health },
      { name: 'manufacturers', endpoint: apiEndpoints.manufacturers.list },
      { name: 'dashboard', endpoint: apiEndpoints.dashboard.stats }
    ];

    for (const { name, endpoint } of keyEndpoints) {
      try {
        endpointTests[name] = await testApiEndpoint(endpoint);
      } catch (error) {
        endpointTests[name] = {
          isValid: false,
          errors: [`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
          warnings: [],
          endpoint
        };
      }
    }
  }

  // Determine overall validity
  const overallValid = configValidation.isValid && 
    Object.values(endpointTests).every(result => result.isValid);

  return {
    configValidation,
    endpointTests,
    overallValid
  };
};

/**
 * Format validation results for display
 */
export const formatValidationResults = (results: {
  configValidation: ApiValidationResult;
  endpointTests: Record<string, ApiValidationResult>;
  overallValid: boolean;
}): string => {
  let output = '=== API Compatibility Test Results ===\n\n';

  // Configuration validation
  output += '1. Configuration Validation:\n';
  if (results.configValidation.isValid) {
    output += '   ✅ Configuration is valid\n';
  } else {
    output += '   ❌ Configuration has errors:\n';
    results.configValidation.errors.forEach(error => {
      output += `      - ${error}\n`;
    });
  }

  if (results.configValidation.warnings.length > 0) {
    output += '   ⚠️  Warnings:\n';
    results.configValidation.warnings.forEach(warning => {
      output += `      - ${warning}\n`;
    });
  }

  // Endpoint tests
  output += '\n2. Endpoint Connectivity Tests:\n';
  Object.entries(results.endpointTests).forEach(([name, result]) => {
    if (result.isValid) {
      output += `   ✅ ${name}: OK (${result.responseTime?.toFixed(0)}ms)\n`;
    } else {
      output += `   ❌ ${name}: FAILED\n`;
      result.errors.forEach(error => {
        output += `      - ${error}\n`;
      });
    }

    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => {
        output += `      ⚠️  ${warning}\n`;
      });
    }
  });

  // Overall result
  output += '\n3. Overall Result:\n';
  if (results.overallValid) {
    output += '   ✅ All tests passed - API is compatible\n';
  } else {
    output += '   ❌ Some tests failed - API may not be fully compatible\n';
  }

  return output;
};

/**
 * Log validation results to console (useful for debugging)
 */
export const logValidationResults = async (): Promise<void> => {
  console.log('Running API compatibility tests...');
  
  try {
    const results = await runApiCompatibilityTests();
    const formattedResults = formatValidationResults(results);
    console.log(formattedResults);
  } catch (error) {
    console.error('Failed to run API compatibility tests:', error);
  }
};

export default {
  validateApiConfiguration,
  testApiEndpoint,
  runApiCompatibilityTests,
  formatValidationResults,
  logValidationResults
};