// Mock API service for valve tokenization
// This simulates the backend API that would handle valve tokenization

import { 
  TokenizeValveRequest, 
  TokenizeValveResponse, 
  ManufacturerAuth, 
  ApiResponse,
  ValveDetails,
  ValveAsset,
  ValveStatus,
  RepairRecord,
  Order,
  DashboardStats
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

// Mock tokenized valves storage with enhanced data for dashboard
let valveAssets: ValveAsset[] = [
  {
    id: 'VLV001',
    serialNumber: 'EMR-2024-001',
    type: 'ball',
    manufacturer: 'Emerson Process Management',
    model: 'Series 2000',
    specifications: {
      diameter: 6,
      pressure: 1500,
      temperature: 200,
      material: 'Stainless Steel 316',
      connectionType: 'Flanged'
    },
    certifications: ['API 6D', 'ISO 14313'],
    manufactureDate: '2024-01-15',
    warrantyMonths: 24,
    tokenId: 'VLV17089471001',
    status: 'pending_tokenization',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'VLV002',
    serialNumber: 'EMR-2024-002',
    type: 'gate',
    manufacturer: 'Emerson Process Management',
    model: 'Series 3000',
    specifications: {
      diameter: 8,
      pressure: 2000,
      temperature: 300,
      material: 'Carbon Steel',
      connectionType: 'Welded'
    },
    certifications: ['API 6D'],
    manufactureDate: '2024-01-20',
    warrantyMonths: 36,
    tokenId: 'VLV17089471002',
    status: 'in_service',
    currentOwner: '0x123...abc',
    location: 'Plant Unit A-1',
    installDate: '2024-02-01',
    lastMaintenanceDate: '2024-03-01',
    nextMaintenanceDate: '2024-09-01',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 'VLV003',
    serialNumber: 'KTZ-2024-001',
    type: 'butterfly',
    manufacturer: 'Kitz Corporation',
    model: 'Model K-100',
    specifications: {
      diameter: 4,
      pressure: 1200,
      temperature: 150,
      material: 'Bronze',
      connectionType: 'Threaded'
    },
    certifications: ['JIS B2071'],
    manufactureDate: '2024-01-25',
    warrantyMonths: 18,
    status: 'in_repair',
    currentOwner: '0x456...def',
    location: 'Plant Unit B-2',
    installDate: '2024-02-15',
    lastMaintenanceDate: '2024-04-15',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-04-15T10:00:00Z'
  }
];

// Mock repair records
let repairRecords: RepairRecord[] = [
  {
    id: 'REP001',
    valveId: 'VLV003',
    contractorId: 'REPAIR_CO_001',
    contractorName: 'Industrial Repair Services',
    startDate: '2024-04-16',
    expectedCompletionDate: '2024-04-20',
    description: 'Actuator replacement and seal inspection',
    status: 'in_progress',
    cost: 1500
  }
];

// Mock orders
let orders: Order[] = [
  {
    id: 'ORD001',
    manufacturerId: 'mfg001',
    distributorId: 'DIST001',
    valveId: 'VLV001',
    quantity: 1,
    status: 'pending',
    orderDate: '2024-01-16',
    expectedDeliveryDate: '2024-01-30',
    notes: 'Urgent delivery required for Plant A installation'
  },
  {
    id: 'ORD002',
    manufacturerId: 'mfg002',
    distributorId: 'DIST002',
    valveId: 'VLV002',
    quantity: 2,
    status: 'confirmed',
    orderDate: '2024-01-18',
    expectedDeliveryDate: '2024-02-05',
    notes: 'Standard delivery'
  }
];

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
    const existingValve = valveAssets.find(v => v.serialNumber === valveDetails.serialNumber);
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

      // Store the tokenized valve with enhanced data
      const newValve: ValveAsset = {
        ...request.valveDetails,
        id: valveId,
        tokenId,
        status: 'tokenized',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      valveAssets.push(newValve);

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
  async getManufacturerValves(manufacturerId: string): Promise<ApiResponse<ValveAsset[]>> {
    await this.delay(500);

    const manufacturerValves = valveAssets.filter(v => 
      v.manufacturer === AUTHORIZED_MANUFACTURERS.find(m => m.id === manufacturerId)?.name
    );
    
    return {
      success: true,
      data: manufacturerValves,
      message: `Retrieved ${manufacturerValves.length} valves for manufacturer`
    };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await this.delay(300);

    const stats: DashboardStats = {
      totalValves: valveAssets.length,
      pendingTokenization: valveAssets.filter(v => v.status === 'pending_tokenization').length,
      inService: valveAssets.filter(v => v.status === 'in_service').length,
      inRepair: valveAssets.filter(v => v.status === 'in_repair').length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      scheduledMaintenance: valveAssets.filter(v => v.status === 'scheduled_maintenance').length
    };

    return {
      success: true,
      data: stats,
      message: 'Dashboard statistics retrieved successfully'
    };
  }

  /**
   * Get valves by status for dashboard filtering
   */
  async getValvesByStatus(status: ValveStatus): Promise<ApiResponse<ValveAsset[]>> {
    await this.delay(500);

    const filteredValves = valveAssets.filter(v => v.status === status);
    
    return {
      success: true,
      data: filteredValves,
      message: `Retrieved ${filteredValves.length} valves with status: ${status}`
    };
  }

  /**
   * Get pending orders for distributor panel
   */
  async getPendingOrders(distributorId?: string): Promise<ApiResponse<Order[]>> {
    await this.delay(500);

    let filteredOrders = orders.filter(o => o.status === 'pending');
    if (distributorId) {
      filteredOrders = filteredOrders.filter(o => o.distributorId === distributorId);
    }
    
    return {
      success: true,
      data: filteredOrders,
      message: `Retrieved ${filteredOrders.length} pending orders`
    };
  }

  /**
   * Get valves in repair for repair panel
   */
  async getValvesInRepair(): Promise<ApiResponse<ValveAsset[]>> {
    await this.delay(500);

    const repairValves = valveAssets.filter(v => v.status === 'in_repair');
    
    return {
      success: true,
      data: repairValves,
      message: `Retrieved ${repairValves.length} valves in repair`
    };
  }

  /**
   * Get repair records
   */
  async getRepairRecords(valveId?: string): Promise<ApiResponse<RepairRecord[]>> {
    await this.delay(500);

    let filteredRecords = repairRecords;
    if (valveId) {
      filteredRecords = repairRecords.filter(r => r.valveId === valveId);
    }
    
    return {
      success: true,
      data: filteredRecords,
      message: `Retrieved ${filteredRecords.length} repair records`
    };
  }

  /**
   * Get plant dashboard data (pending installation, service, repair counts)
   */
  async getPlantDashboardData(): Promise<ApiResponse<{
    pendingInstallation: ValveAsset[];
    scheduledMaintenance: ValveAsset[];
    inRepair: ValveAsset[];
    inServiceCount: number;
  }>> {
    await this.delay(500);

    const data = {
      pendingInstallation: valveAssets.filter(v => v.status === 'pending_installation'),
      scheduledMaintenance: valveAssets.filter(v => v.status === 'scheduled_maintenance'),
      inRepair: valveAssets.filter(v => v.status === 'in_repair'),
      inServiceCount: valveAssets.filter(v => v.status === 'in_service').length
    };
    
    return {
      success: true,
      data,
      message: 'Plant dashboard data retrieved successfully'
    };
  }
}

// Export singleton instance
export const valveApiService = new ValveApiService();
export default valveApiService;