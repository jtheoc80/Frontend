/**
 * API Compatibility Test Script
 * 
 * This script can be run to test frontend-backend compatibility.
 * Usage: Include this in your development workflow to validate API connectivity.
 */

import { logValidationResults } from '../utils/apiValidation';

/**
 * Run API compatibility tests
 * This can be called from development tools or added to startup checks
 */
export const runCompatibilityCheck = async (): Promise<void> => {
  console.log('🔍 Starting Frontend-Backend API Compatibility Check...\n');
  
  try {
    await logValidationResults();
    console.log('\n✨ Compatibility check completed');
  } catch (error) {
    console.error('💥 Compatibility check failed:', error);
  }
};

// Auto-run in development mode
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_API_DEBUG_LOGGING === 'true') {
  // Run compatibility check on module load (in development)
  runCompatibilityCheck().catch(console.error);
}

export default runCompatibilityCheck;