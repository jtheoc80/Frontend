import React, { useEffect, useState } from 'react';
import { logger } from '../../utils/logger';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    api: boolean;
    blockchain: boolean;
    localization: boolean;
  };
}

/**
 * Health check component for monitoring application status
 * Used by container orchestration systems and monitoring tools
 */
const HealthCheck: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);

  const performHealthChecks = async (): Promise<HealthStatus> => {
    const startTime = performance.now();
    
    try {
      // API connectivity check
      const apiHealthy = await checkApiHealth();
      
      // Blockchain connectivity check (if applicable)
      const blockchainHealthy = await checkBlockchainHealth();
      
      // Localization check
      const localizationHealthy = checkLocalization();

      const allChecksHealthy = apiHealthy && blockchainHealthy && localizationHealthy;
      const anyCheckFailed = !apiHealthy || !blockchainHealthy || !localizationHealthy;

      const status: HealthStatus = {
        status: allChecksHealthy ? 'healthy' : anyCheckFailed ? 'degraded' : 'unhealthy',
        timestamp: new Date().toISOString(),
        version: process.env.REACT_APP_VERSION || '0.1.0',
        environment: process.env.REACT_APP_ENVIRONMENT || 'development',
        checks: {
          api: apiHealthy,
          blockchain: blockchainHealthy,
          localization: localizationHealthy,
        },
      };

      const duration = performance.now() - startTime;
      logger.performanceMetric('health-check', duration, {
        component: 'HealthCheck',
        status: status.status,
      });

      return status;
    } catch (error) {
      logger.error('Health check failed', {
        component: 'HealthCheck',
      }, error as Error);

      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: process.env.REACT_APP_VERSION || '0.1.0',
        environment: process.env.REACT_APP_ENVIRONMENT || 'development',
        checks: {
          api: false,
          blockchain: false,
          localization: false,
        },
      };
    }
  };

  const checkApiHealth = async (): Promise<boolean> => {
    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL;
      if (!apiUrl) return true; // Skip if no API configured

      // Simple connectivity check
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        timeout: 5000,
      } as RequestInit);

      return response.ok;
    } catch (error) {
      logger.warn('API health check failed', {
        component: 'HealthCheck',
        check: 'api',
      }, error as Error);
      return false;
    }
  };

  const checkBlockchainHealth = async (): Promise<boolean> => {
    try {
      const rpcUrl = process.env.REACT_APP_ETHEREUM_RPC_URL;
      if (!rpcUrl || process.env.REACT_APP_ENABLE_MOCK_DATA === 'true') {
        return true; // Skip if using mock data
      }

      // Simple RPC connectivity check
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        }),
        timeout: 5000,
      } as RequestInit);

      return response.ok;
    } catch (error) {
      logger.warn('Blockchain health check failed', {
        component: 'HealthCheck',
        check: 'blockchain',
      }, error as Error);
      return false;
    }
  };

  const checkLocalization = (): boolean => {
    try {
      // Check if i18n is properly initialized
      const supportedLanguages = process.env.REACT_APP_SUPPORTED_LANGUAGES?.split(',') || ['en'];
      return supportedLanguages.length > 0;
    } catch (error) {
      logger.warn('Localization health check failed', {
        component: 'HealthCheck',
        check: 'localization',
      }, error as Error);
      return false;
    }
  };

  useEffect(() => {
    // Perform health check on mount
    performHealthChecks().then(setHealthStatus);

    // Set up periodic health checks (every 5 minutes)
    const interval = setInterval(async () => {
      const status = await performHealthChecks();
      setHealthStatus(status);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // This component doesn't render anything in the UI
  // It's primarily for internal monitoring
  if (process.env.NODE_ENV === 'development' && healthStatus) {
    // Show health status in development
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: 'white',
          backgroundColor: healthStatus.status === 'healthy' ? 'green' : 
                           healthStatus.status === 'degraded' ? 'orange' : 'red',
          zIndex: 9999,
        }}
      >
        Health: {healthStatus.status} | API: {healthStatus.checks.api ? '✓' : '✗'} | 
        Blockchain: {healthStatus.checks.blockchain ? '✓' : '✗'} | 
        i18n: {healthStatus.checks.localization ? '✓' : '✗'}
      </div>
    );
  }

  return null;
};

// Export health check function for use by external monitoring
export const getHealthStatus = async (): Promise<HealthStatus> => {
  const healthCheck = new (HealthCheck as any)();
  return await healthCheck.performHealthChecks();
};

export default HealthCheck;