// Mock API service for valve tokenization
// This simulates the backend API that would handle valve tokenization

import { 
  TokenizeValveRequest, 
  TokenizeValveResponse, 
  ManufacturerAuth, 
  ApiResponse,
  ValveDetails,
  TerminationRequest,
  TerminationRequestData,
  TerminationApprovalData,
  TerminationApproval
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

// Mock termination requests storage
let terminationRequests: TerminationRequest[] = [];

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

  /**
   * Generate unique termination request ID
   */
  private generateTerminationId(): string {
    return 'TERM' + Date.now() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  }

  /**
   * Validate termination request data
   */
  private validateTerminationRequest(data: TerminationRequestData): string[] {
    const errors: string[] = [];

    if (!data.valveSerialNumber || data.valveSerialNumber.trim().length < 3) {
      errors.push('Valve serial number is required');
    }

    if (!data.reason) {
      errors.push('Termination reason is required');
    }

    if (data.reason === 'other' && (!data.customReason || data.customReason.trim().length < 5)) {
      errors.push('Custom reason must be at least 5 characters when selecting "other"');
    }

    if (data.reason === 'high_repair_cost') {
      if (!data.repairCost || data.repairCost <= 0) {
        errors.push('Repair cost is required for high repair cost termination');
      }
      if (!data.newValveCost || data.newValveCost <= 0) {
        errors.push('New valve cost is required for cost comparison');
      }
      if (data.repairCost && data.newValveCost && data.repairCost <= data.newValveCost) {
        errors.push('Repair cost must be higher than new valve cost to justify termination');
      }
    }

    // Check if valve exists
    const valveSerialSet = new Set(tokenizedValves.map(v => v.serialNumber));
    const valveExists = valveSerialSet.has(data.valveSerialNumber);
    if (!valveExists) {
      errors.push('Valve with this serial number not found in system');
    }

    // Check if there's already a pending termination request
    // Build an index of termination requests by valve serial number for efficient lookup
    const terminationRequestIndex: Map<string, TerminationRequest[]> = new Map();
    for (const req of terminationRequests) {
      if (!terminationRequestIndex.has(req.valveSerialNumber)) {
        terminationRequestIndex.set(req.valveSerialNumber, []);
      }
      terminationRequestIndex.get(req.valveSerialNumber)!.push(req);
    }
    const requestsForValve = terminationRequestIndex.get(data.valveSerialNumber) || [];
    const existingRequest = requestsForValve.find(r => r.status === 'pending');
    if (existingRequest) {
      errors.push('There is already a pending termination request for this valve');
    }

    return errors;
  }

  /**
   * Submit a termination request (repair role)
   */
  async submitTerminationRequest(data: TerminationRequestData, requestedBy: string): Promise<ApiResponse<TerminationRequest>> {
    await this.delay(1000);

    try {
      // Validate request data
      const validationErrors = this.validateTerminationRequest(data);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Termination request validation failed',
          errors: validationErrors
        };
      }

      // Create termination request
      const terminationRequest: TerminationRequest = {
        id: this.generateTerminationId(),
        valveSerialNumber: data.valveSerialNumber,
        requestedBy,
        reason: data.reason,
        customReason: data.customReason,
        repairCost: data.repairCost,
        newValveCost: data.newValveCost,
        requestDate: new Date().toISOString(),
        status: 'pending',
        approvals: {
          repair: null,
          plant: null
        }
      };

      terminationRequests.push(terminationRequest);

      return {
        success: true,
        data: terminationRequest,
        message: 'Termination request submitted successfully'
      };

    } catch (error) {
      console.error('Termination request error:', error);
      return {
        success: false,
        message: 'Internal server error during termination request',
        errors: ['An unexpected error occurred. Please try again.']
      };
    }
  }

  /**
   * Get all termination requests
   */
  async getTerminationRequests(): Promise<ApiResponse<TerminationRequest[]>> {
    await this.delay(300);
    
    return {
      success: true,
      data: terminationRequests,
      message: `Retrieved ${terminationRequests.length} termination requests`
    };
  }

  /**
   * Get termination requests for a specific valve
   */
  async getTerminationRequestsByValve(valveSerialNumber: string): Promise<ApiResponse<TerminationRequest[]>> {
    await this.delay(300);
    
    const valveRequests = terminationRequests.filter(r => r.valveSerialNumber === valveSerialNumber);
    
    return {
      success: true,
      data: valveRequests,
      message: `Retrieved ${valveRequests.length} termination requests for valve ${valveSerialNumber}`
    };
  }

  /**
   * Approve or reject a termination request
   */
  async submitTerminationApproval(data: TerminationApprovalData, approvedBy: string): Promise<ApiResponse<TerminationRequest>> {
    await this.delay(1000);

    try {
      // Find the termination request
      const requestIndex = terminationRequests.findIndex(r => r.id === data.terminationRequestId);
      if (requestIndex === -1) {
        return {
          success: false,
          message: 'Termination request not found',
          errors: ['Invalid termination request ID']
        };
      }

      const request = terminationRequests[requestIndex];

      // Check if request is still pending
      if (request.status !== 'pending') {
        return {
          success: false,
          message: 'This termination request has already been processed',
          errors: ['Request is no longer pending']
        };
      }

      // Check if this role has already provided approval
      if (request.approvals[data.role] !== null) {
        return {
          success: false,
          message: `${data.role} role has already provided approval for this request`,
          errors: ['Duplicate approval not allowed']
        };
      }

      // Create approval record
      const approval: TerminationApproval = {
        approvedBy,
        approvalDate: new Date().toISOString(),
        approved: data.approved,
        comments: data.comments
      };

      // Update the request with the approval
      request.approvals[data.role] = approval;

      // Check if we now have both approvals
      const repairApproval = request.approvals.repair;
      const plantApproval = request.approvals.plant;

      if (repairApproval && plantApproval) {
        // Both roles have provided approval, determine final status
        if (repairApproval.approved && plantApproval.approved) {
          request.status = 'approved';
        } else {
          request.status = 'rejected';
        }
      }

      return {
        success: true,
        data: request,
        message: `${data.role} approval recorded successfully`
      };

    } catch (error) {
      console.error('Termination approval error:', error);
      return {
        success: false,
        message: 'Internal server error during approval processing',
        errors: ['An unexpected error occurred. Please try again.']
      };
    }
  }
}

// Export singleton instance
export const valveApiService = new ValveApiService();
export default valveApiService;