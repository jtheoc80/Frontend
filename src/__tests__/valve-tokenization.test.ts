// Tests for valve tokenization functionality
import { validateValveDetails, validateSerialNumber, validateSpecifications } from '../utils/validation';
import { ValveDetails } from '../types/valve';
import valveApiService from '../services/valveApi';

describe('Valve Validation', () => {
  describe('validateSerialNumber', () => {
    test('should validate correct serial numbers', () => {
      const result = validateSerialNumber('ABC123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject empty serial numbers', () => {
      const result = validateSerialNumber('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Serial number is required');
    });

    test('should reject serial numbers that are too short', () => {
      const result = validateSerialNumber('AB');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Serial number must be at least 3 characters long');
    });

    test('should reject serial numbers with invalid characters', () => {
      const result = validateSerialNumber('ABC@123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Serial number can only contain letters, numbers, hyphens, and underscores');
    });
  });

  describe('validateSpecifications', () => {
    test('should validate correct specifications', () => {
      const specs = {
        diameter: 6,
        pressure: 150,
        temperature: 200,
        material: 'Stainless Steel 316',
        connectionType: 'Flanged'
      };
      const result = validateSpecifications(specs);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid diameter', () => {
      const specs = {
        diameter: 0,
        pressure: 150,
        temperature: 200,
        material: 'Stainless Steel 316',
        connectionType: 'Flanged'
      };
      const result = validateSpecifications(specs);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Diameter must be greater than 0');
    });

    test('should reject invalid pressure', () => {
      const specs = {
        diameter: 6,
        pressure: -10,
        temperature: 200,
        material: 'Stainless Steel 316',
        connectionType: 'Flanged'
      };
      const result = validateSpecifications(specs);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Pressure rating must be greater than 0');
    });
  });

  describe('validateValveDetails', () => {
    const validValveDetails: ValveDetails = {
      serialNumber: 'VLV-2024-001',
      type: 'ball',
      manufacturer: 'Emerson Process Management',
      model: 'A100',
      specifications: {
        diameter: 6,
        pressure: 150,
        temperature: 200,
        material: 'Stainless Steel 316',
        connectionType: 'Flanged'
      },
      certifications: ['API 6D', 'ISO 14313'],
      manufactureDate: '2024-01-15',
      warrantyMonths: 24
    };

    test('should validate complete valid valve details', () => {
      const result = validateValveDetails(validValveDetails);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject valve details with missing required fields', () => {
      const incompleteDetails = { ...validValveDetails };
      delete (incompleteDetails as any).serialNumber;
      
      const result = validateValveDetails(incompleteDetails);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Serial number is required');
    });
  });
});

describe('Valve API Service', () => {
  describe('validateManufacturer', () => {
    test('should validate authorized manufacturer', async () => {
      const result = await valveApiService.validateManufacturer('mfg001');
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('Emerson Process Management');
      expect(result.data?.permissions).toContain('tokenize_valves');
    });

    test('should reject unauthorized manufacturer', async () => {
      const result = await valveApiService.validateManufacturer('invalid-id');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Manufacturer not found');
    });

    test('should reject mismatched wallet address', async () => {
      const result = await valveApiService.validateManufacturer('mfg001', '0xinvalidaddress');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Wallet address does not match registered manufacturer');
    });
  });

  describe('tokenizeValve', () => {
    const validRequest = {
      manufacturerId: 'mfg001',
      valveDetails: {
        serialNumber: 'TEST-VLV-001',
        type: 'ball' as const,
        manufacturer: 'Emerson Process Management',
        model: 'A100',
        specifications: {
          diameter: 6,
          pressure: 150,
          temperature: 200,
          material: 'Stainless Steel 316',
          connectionType: 'Flanged'
        },
        certifications: ['API 6D'],
        manufactureDate: '2024-01-15',
        warrantyMonths: 24
      }
    };

    test('should successfully tokenize valid valve', async () => {
      const result = await valveApiService.tokenizeValve(validRequest);
      expect(result.success).toBe(true);
      expect(result.tokenId).toBeDefined();
      expect(result.transactionHash).toBeDefined();
      expect(result.valveId).toBeDefined();
      expect(result.message).toBe('Valve successfully tokenized');
    });

    test('should reject duplicate serial number', async () => {
      // First tokenization should succeed
      await valveApiService.tokenizeValve(validRequest);
      
      // Second tokenization with same serial should fail
      const result = await valveApiService.tokenizeValve(validRequest);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('A valve with this serial number has already been tokenized');
    });

    test('should reject unauthorized manufacturer', async () => {
      const invalidRequest = {
        ...validRequest,
        manufacturerId: 'invalid-id'
      };
      
      const result = await valveApiService.tokenizeValve(invalidRequest);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Manufacturer authentication failed');
    });

    test('should reject invalid valve details', async () => {
      const invalidRequest = {
        ...validRequest,
        valveDetails: {
          ...validRequest.valveDetails,
          serialNumber: '' // Invalid empty serial number
        }
      };
      
      const result = await valveApiService.tokenizeValve(invalidRequest);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Valve details validation failed');
      expect(result.errors).toContain('Serial number must be at least 3 characters long');
    });
  });

  describe('getManufacturers', () => {
    test('should return list of manufacturers', async () => {
      const result = await valveApiService.getManufacturers();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.length).toBeGreaterThan(0);
      expect(result.data![0]).toHaveProperty('id');
      expect(result.data![0]).toHaveProperty('name');
      expect(result.data![0]).toHaveProperty('permissions');
    });
  });

  describe('getManufacturerValves', () => {
    test('should return empty list for manufacturer with no valves', async () => {
      const result = await valveApiService.getManufacturerValves('mfg002');
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.length).toBe(0);
    });
  });
});

describe('Integration Tests', () => {
  test('should complete full valve tokenization flow', async () => {
    // 1. Validate manufacturer
    const authResult = await valveApiService.validateManufacturer('mfg001');
    expect(authResult.success).toBe(true);
    
    // 2. Prepare valve details
    const valveDetails: ValveDetails = {
      serialNumber: 'INTEGRATION-TEST-001',
      type: 'gate',
      manufacturer: authResult.data!.name,
      model: 'GT-500',
      specifications: {
        diameter: 8,
        pressure: 300,
        temperature: 150,
        material: 'Carbon Steel',
        connectionType: 'Threaded'
      },
      certifications: ['ASME B16.34'],
      manufactureDate: '2024-02-01',
      warrantyMonths: 12
    };
    
    // 3. Validate valve details
    const validationResult = validateValveDetails(valveDetails);
    expect(validationResult.isValid).toBe(true);
    
    // 4. Tokenize valve
    const tokenizeResult = await valveApiService.tokenizeValve({
      manufacturerId: authResult.data!.id,
      valveDetails
    });
    expect(tokenizeResult.success).toBe(true);
    expect(tokenizeResult.tokenId).toBeDefined();
    
    // 5. Verify valve appears in manufacturer's list
    const valvesResult = await valveApiService.getManufacturerValves(authResult.data!.id);
    expect(valvesResult.success).toBe(true);
    expect(valvesResult.data!.length).toBeGreaterThan(0);
    
    const tokenizedValve = valvesResult.data!.find(v => v.serialNumber === 'INTEGRATION-TEST-001');
    expect(tokenizedValve).toBeDefined();
    expect(tokenizedValve!.tokenId).toBe(tokenizeResult.tokenId);
  });
});