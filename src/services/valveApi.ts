// Mock API service for valve tokenization
// This simulates the backend API that would handle valve tokenization

import { 
  TokenizeValveRequest, 
  TokenizeValveResponse, 
  ManufacturerAuth, 
  ApiResponse,
  ValveDetails 
} from '../types/valve';

// Mock manufacturer database
const AUTHORIZED_MANUFACTURERS = [
  {
    id: 'mfg001',
    name: 'Emerson Process Management',
    walletAddress: '0x742d35Cc6436C0532925a3b8D0000a5492d95a8b',
    permissions: ['tokenize_valves', 'read_inventory']
  },
  {
    id: 'mfg002', 
    name: 'Kitz Corporation',
    walletAddress: '0x742d35Cc6436C0532925a3b8D0000a5492d95a8c',
    permissions: ['tokenize_valves', 'read_inventory']
  }
];

// Mock tokenized valves storage
let tokenizedValves: Array<ValveDetails & { tokenId: string, manufacturerId: string }> = [];

class ValveApiService {
  private baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

  /**
   * Simulate API delay for realistic testing
   */
  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate mock transaction hash
   */
  private generateTransactionHash(): string {
    return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  /**
   * Generate mock token ID
   */
  private generateTokenId(): string {
    return 'VLV' + Date.now() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  }

  /**
   * Validate manufacturer authentication
   */
  async validateManufacturer(manufacturerId: string, walletAddress?: string): Promise<ApiResponse<ManufacturerAuth>> {
    await this.delay(500);

    const manufacturer = AUTHORIZED_MANUFACTURERS.find(m => m.id === manufacturerId);
    
    if (!manufacturer) {
      return {
        success: false,
        message: 'Manufacturer not found',
        errors: ['Invalid manufacturer ID']
      };
    }

    if (walletAddress && manufacturer.walletAddress !== walletAddress) {
      return {
        success: false,
        message: 'Wallet address does not match registered manufacturer',
        errors: ['Unauthorized wallet address']
      };
    }

    return {
      success: true,
      data: {
        id: manufacturer.id,
        name: manufacturer.name,
        isAuthenticated: true,
        walletAddress: manufacturer.walletAddress,
        permissions: manufacturer.permissions
      },
      message: 'Manufacturer authenticated successfully'
    };
  }

  /**
   * Validate valve details for tokenization
   */
  private validateValveDetails(valveDetails: ValveDetails): string[] {
    const errors: string[] = [];

    if (!valveDetails.serialNumber || valveDetails.serialNumber.trim().length < 3) {
      errors.push('Serial number must be at least 3 characters long');
    }

    if (!valveDetails.type) {
      errors.push('Valve type is required');
    }

    if (!valveDetails.manufacturer || valveDetails.manufacturer.trim().length < 2) {
      errors.push('Manufacturer name is required');
    }

    if (!valveDetails.model || valveDetails.model.trim().length < 1) {
      errors.push('Model is required');
    }

    if (valveDetails.specifications.diameter <= 0) {
      errors.push('Valve diameter must be greater than 0');
    }

    if (valveDetails.specifications.pressure <= 0) {
      errors.push('Pressure rating must be greater than 0');
    }

    if (valveDetails.specifications.temperature < -273) {
      errors.push('Temperature rating must be above absolute zero');
    }

    if (!valveDetails.specifications.material || valveDetails.specifications.material.trim().length < 2) {
      errors.push('Material specification is required');
    }

    if (!valveDetails.specifications.connectionType || valveDetails.specifications.connectionType.trim().length < 2) {
      errors.push('Connection type is required');
    }

    if (!valveDetails.manufactureDate) {
      errors.push('Manufacture date is required');
    }

    if (valveDetails.warrantyMonths < 0) {
      errors.push('Warranty months cannot be negative');
    }

    // Check for duplicate serial numbers
    const existingValve = tokenizedValves.find(v => v.serialNumber === valveDetails.serialNumber);
    if (existingValve) {
      errors.push('A valve with this serial number has already been tokenized');
    }

    return errors;
  }

  /**
   * Tokenize a new valve
   */
  async tokenizeValve(request: TokenizeValveRequest): Promise<TokenizeValveResponse> {
    await this.delay(2000); // Simulate blockchain transaction time

    try {
      // Validate manufacturer
      const authResult = await this.validateManufacturer(request.manufacturerId);
      if (!authResult.success) {
        return {
          success: false,
          message: 'Manufacturer authentication failed',
          errors: authResult.errors
        };
      }

      // Check if manufacturer has tokenization permissions
      if (!authResult.data?.permissions.includes('tokenize_valves')) {
        return {
          success: false,
          message: 'Manufacturer does not have permission to tokenize valves',
          errors: ['Insufficient permissions']
        };
      }

      // Validate valve details
      const validationErrors = this.validateValveDetails(request.valveDetails);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Valve details validation failed',
          errors: validationErrors
        };
      }

      // Generate tokenization result
      const tokenId = this.generateTokenId();
      const transactionHash = this.generateTransactionHash();
      const valveId = `${request.valveDetails.manufacturer.substring(0, 3).toUpperCase()}-${tokenId}`;

      // Store the tokenized valve
      tokenizedValves.push({
        ...request.valveDetails,
        tokenId,
        manufacturerId: request.manufacturerId
      });

      return {
        success: true,
        tokenId,
        transactionHash,
        valveId,
        message: 'Valve successfully tokenized'
      };

    } catch (error) {
      console.error('Valve tokenization error:', error);
      return {
        success: false,
        message: 'Internal server error during valve tokenization',
        errors: ['An unexpected error occurred. Please try again.']
      };
    }
  }

  /**
   * Get list of manufacturers (for dropdown/selection)
   */
  async getManufacturers(): Promise<ApiResponse<typeof AUTHORIZED_MANUFACTURERS>> {
    await this.delay(300);
    
    return {
      success: true,
      data: AUTHORIZED_MANUFACTURERS,
      message: 'Manufacturers retrieved successfully'
    };
  }

  /**
   * Get tokenized valves for a manufacturer
   */
  async getManufacturerValves(manufacturerId: string): Promise<ApiResponse<Array<ValveDetails & { tokenId: string }>>> {
    await this.delay(500);

    const manufacturerValves = tokenizedValves.filter(v => v.manufacturerId === manufacturerId);
    
    return {
      success: true,
      data: manufacturerValves,
      message: `Retrieved ${manufacturerValves.length} valves for manufacturer`
    };
  }
}

// Export singleton instance
export const valveApiService = new ValveApiService();
export default valveApiService;