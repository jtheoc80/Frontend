// Tests for valve termination workflow functionality
import { 
  validateTerminationReason, 
  validateCostComparison, 
  validateApprovalComments 
} from '../utils/validation';
import valveApiService from '../services/valveApi';
import { TerminationRequestData, TerminationApprovalData } from '../types/valve';

describe('Termination Validation', () => {
  describe('validateTerminationReason', () => {
    test('should validate high repair cost reason', () => {
      const result = validateTerminationReason('high_repair_cost');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate beyond economical repair reason', () => {
      const result = validateTerminationReason('beyond_economical_repair');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate other reason with custom text', () => {
      const result = validateTerminationReason('other', 'Valve is severely corroded');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject empty reason', () => {
      const result = validateTerminationReason('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Termination reason is required');
    });

    test('should reject other reason without custom text', () => {
      const result = validateTerminationReason('other');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Custom reason must be at least 5 characters when selecting "other"');
    });

    test('should reject other reason with short custom text', () => {
      const result = validateTerminationReason('other', 'bad');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Custom reason must be at least 5 characters when selecting "other"');
    });
  });

  describe('validateCostComparison', () => {
    test('should validate when repair cost is higher than new valve cost', () => {
      const result = validateCostComparison(1500, 1000);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject when repair cost is zero', () => {
      const result = validateCostComparison(0, 1000);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Repair cost must be greater than 0');
    });

    test('should reject when new valve cost is zero', () => {
      const result = validateCostComparison(1500, 0);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('New valve cost must be greater than 0');
    });

    test('should reject when repair cost is lower than new valve cost', () => {
      const result = validateCostComparison(800, 1000);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Repair cost must be higher than new valve cost to justify termination');
    });

    test('should reject when repair cost equals new valve cost', () => {
      const result = validateCostComparison(1000, 1000);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Repair cost must be higher than new valve cost to justify termination');
    });

    test('should pass when costs are undefined', () => {
      const result = validateCostComparison(undefined, undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateApprovalComments', () => {
    test('should validate short comments', () => {
      const result = validateApprovalComments('Approved after review');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate empty comments', () => {
      const result = validateApprovalComments('');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate undefined comments', () => {
      const result = validateApprovalComments(undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject comments over 500 characters', () => {
      const longComment = 'A'.repeat(501);
      const result = validateApprovalComments(longComment);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Comments cannot exceed 500 characters');
    });

    test('should validate comments at 500 characters', () => {
      const maxComment = 'A'.repeat(500);
      const result = validateApprovalComments(maxComment);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});

describe('Termination API Service', () => {
  // First, let's add a test valve to the system
  beforeAll(async () => {
    await valveApiService.tokenizeValve({
      manufacturerId: 'mfg001',
      valveDetails: {
        serialNumber: 'TERM-TEST-001',
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
        certifications: ['API 6D'],
        manufactureDate: '2024-01-15',
        warrantyMonths: 24
      }
    });
  });

  describe('submitTerminationRequest', () => {
    test('should successfully submit high repair cost termination request', async () => {
      const requestData: TerminationRequestData = {
        valveSerialNumber: 'TERM-TEST-001',
        reason: 'high_repair_cost',
        repairCost: 2000,
        newValveCost: 1500
      };

      const result = await valveApiService.submitTerminationRequest(requestData, 'repair-user');
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.valveSerialNumber).toBe('TERM-TEST-001');
      expect(result.data!.reason).toBe('high_repair_cost');
      expect(result.data!.status).toBe('pending');
      expect(result.data!.approvals.repair).toBeNull();
      expect(result.data!.approvals.plant).toBeNull();
    });

    test('should successfully submit BER termination request', async () => {
      // Need a different valve for this test
      await valveApiService.tokenizeValve({
        manufacturerId: 'mfg001',
        valveDetails: {
          serialNumber: 'TERM-TEST-002',
          type: 'gate',
          manufacturer: 'Emerson Process Management',
          model: 'B200',
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
        }
      });

      const requestData: TerminationRequestData = {
        valveSerialNumber: 'TERM-TEST-002',
        reason: 'beyond_economical_repair'
      };

      const result = await valveApiService.submitTerminationRequest(requestData, 'repair-user');
      expect(result.success).toBe(true);
      expect(result.data!.reason).toBe('beyond_economical_repair');
    });

    test('should successfully submit other reason termination request', async () => {
      // Need another valve for this test
      await valveApiService.tokenizeValve({
        manufacturerId: 'mfg001',
        valveDetails: {
          serialNumber: 'TERM-TEST-003',
          type: 'butterfly',
          manufacturer: 'Emerson Process Management',
          model: 'C300',
          specifications: {
            diameter: 4,
            pressure: 200,
            temperature: 100,
            material: 'Bronze',
            connectionType: 'Wafer'
          },
          certifications: ['API 609'],
          manufactureDate: '2024-03-01',
          warrantyMonths: 18
        }
      });

      const requestData: TerminationRequestData = {
        valveSerialNumber: 'TERM-TEST-003',
        reason: 'other',
        customReason: 'Valve has severe internal corrosion that cannot be repaired'
      };

      const result = await valveApiService.submitTerminationRequest(requestData, 'repair-user');
      expect(result.success).toBe(true);
      expect(result.data!.reason).toBe('other');
      expect(result.data!.customReason).toBe('Valve has severe internal corrosion that cannot be repaired');
    });

    test('should reject termination for non-existent valve', async () => {
      const requestData: TerminationRequestData = {
        valveSerialNumber: 'NON-EXISTENT',
        reason: 'beyond_economical_repair'
      };

      const result = await valveApiService.submitTerminationRequest(requestData, 'repair-user');
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Valve with this serial number not found in system');
    });

    test('should reject duplicate termination requests', async () => {
      const requestData: TerminationRequestData = {
        valveSerialNumber: 'TERM-TEST-001',
        reason: 'beyond_economical_repair'
      };

      const result = await valveApiService.submitTerminationRequest(requestData, 'repair-user');
      expect(result.success).toBe(false);
      expect(result.errors).toContain('There is already a pending termination request for this valve');
    });

    test('should reject invalid cost comparison', async () => {
      // Create another valve for this test
      await valveApiService.tokenizeValve({
        manufacturerId: 'mfg001',
        valveDetails: {
          serialNumber: 'TERM-TEST-004',
          type: 'check',
          manufacturer: 'Emerson Process Management',
          model: 'D400',
          specifications: {
            diameter: 3,
            pressure: 250,
            temperature: 120,
            material: 'Stainless Steel 304',
            connectionType: 'Threaded'
          },
          certifications: ['API 6D'],
          manufactureDate: '2024-04-01',
          warrantyMonths: 24
        }
      });

      const requestData: TerminationRequestData = {
        valveSerialNumber: 'TERM-TEST-004',
        reason: 'high_repair_cost',
        repairCost: 800,
        newValveCost: 1000
      };

      const result = await valveApiService.submitTerminationRequest(requestData, 'repair-user');
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Repair cost must be higher than new valve cost to justify termination');
    });
  });

  describe('getTerminationRequests', () => {
    test('should return list of termination requests', async () => {
      const result = await valveApiService.getTerminationRequests();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data!.length).toBeGreaterThan(0);
    });
  });

  describe('submitTerminationApproval', () => {
    let testRequestId: string;

    beforeAll(async () => {
      // Create a valve and termination request for approval testing
      await valveApiService.tokenizeValve({
        manufacturerId: 'mfg001',
        valveDetails: {
          serialNumber: 'APPROVAL-TEST-001',
          type: 'needle',
          manufacturer: 'Emerson Process Management',
          model: 'E500',
          specifications: {
            diameter: 2,
            pressure: 400,
            temperature: 80,
            material: 'Hastelloy',
            connectionType: 'Socket Weld'
          },
          certifications: ['ASME B16.34'],
          manufactureDate: '2024-05-01',
          warrantyMonths: 36
        }
      });

      const requestResult = await valveApiService.submitTerminationRequest({
        valveSerialNumber: 'APPROVAL-TEST-001',
        reason: 'beyond_economical_repair'
      }, 'repair-user');

      testRequestId = requestResult.data!.id;
    });

    test('should successfully approve termination (repair role)', async () => {
      const approvalData: TerminationApprovalData = {
        terminationRequestId: testRequestId,
        role: 'repair',
        approved: true,
        comments: 'Valve is beyond economical repair'
      };

      const result = await valveApiService.submitTerminationApproval(approvalData, 'repair-manager');
      expect(result.success).toBe(true);
      expect(result.data!.approvals.repair).toBeDefined();
      expect(result.data!.approvals.repair!.approved).toBe(true);
      expect(result.data!.approvals.repair!.comments).toBe('Valve is beyond economical repair');
      expect(result.data!.status).toBe('pending'); // Still pending plant approval
    });

    test('should successfully approve termination (plant role) and finalize approval', async () => {
      const approvalData: TerminationApprovalData = {
        terminationRequestId: testRequestId,
        role: 'plant',
        approved: true,
        comments: 'Approved for termination'
      };

      const result = await valveApiService.submitTerminationApproval(approvalData, 'plant-manager');
      expect(result.success).toBe(true);
      expect(result.data!.approvals.plant).toBeDefined();
      expect(result.data!.approvals.plant!.approved).toBe(true);
      expect(result.data!.status).toBe('approved'); // Both approvals complete
    });

    test('should reject approval for non-existent request', async () => {
      const approvalData: TerminationApprovalData = {
        terminationRequestId: 'NON-EXISTENT',
        role: 'repair',
        approved: true
      };

      const result = await valveApiService.submitTerminationApproval(approvalData, 'repair-manager');
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid termination request ID');
    });

    test('should reject duplicate approval from same role', async () => {
      // Create a new termination request for this test
      await valveApiService.tokenizeValve({
        manufacturerId: 'mfg001',
        valveDetails: {
          serialNumber: 'DUPLICATE-TEST-001',
          type: 'ball',
          manufacturer: 'Emerson Process Management',
          model: 'DUP100',
          specifications: {
            diameter: 5,
            pressure: 175,
            temperature: 180,
            material: 'Stainless Steel 316L',
            connectionType: 'Flanged'
          },
          certifications: ['API 6D'],
          manufactureDate: '2024-07-01',
          warrantyMonths: 24
        }
      });

      const requestResult = await valveApiService.submitTerminationRequest({
        valveSerialNumber: 'DUPLICATE-TEST-001',
        reason: 'beyond_economical_repair'
      }, 'repair-user');

      const duplicateTestRequestId = requestResult.data!.id;

      // First approval
      await valveApiService.submitTerminationApproval({
        terminationRequestId: duplicateTestRequestId,
        role: 'repair',
        approved: true
      }, 'repair-manager');

      // Second approval attempt from same role
      const approvalData: TerminationApprovalData = {
        terminationRequestId: duplicateTestRequestId,
        role: 'repair',
        approved: false
      };

      const result = await valveApiService.submitTerminationApproval(approvalData, 'repair-manager');
      expect(result.success).toBe(false);
      expect(result.message).toContain('repair role has already provided approval');
    }, 15000); // Increase timeout to 15 seconds
  });

  describe('Rejection Workflow', () => {
    let rejectionTestRequestId: string;

    beforeAll(async () => {
      // Create a valve and termination request for rejection testing
      await valveApiService.tokenizeValve({
        manufacturerId: 'mfg001',
        valveDetails: {
          serialNumber: 'REJECTION-TEST-001',
          type: 'plug',
          manufacturer: 'Emerson Process Management',
          model: 'F600',
          specifications: {
            diameter: 1,
            pressure: 600,
            temperature: 60,
            material: 'Inconel',
            connectionType: 'NPT'
          },
          certifications: ['API 6D'],
          manufactureDate: '2024-06-01',
          warrantyMonths: 48
        }
      });

      const requestResult = await valveApiService.submitTerminationRequest({
        valveSerialNumber: 'REJECTION-TEST-001',
        reason: 'high_repair_cost',
        repairCost: 1200,
        newValveCost: 1000
      }, 'repair-user');

      rejectionTestRequestId = requestResult.data!.id;
    });

    test('should handle rejection workflow correctly', async () => {
      // Repair approves
      await valveApiService.submitTerminationApproval({
        terminationRequestId: rejectionTestRequestId,
        role: 'repair',
        approved: true,
        comments: 'Repair cost is justified'
      }, 'repair-manager');

      // Plant rejects
      const plantRejection = await valveApiService.submitTerminationApproval({
        terminationRequestId: rejectionTestRequestId,
        role: 'plant',
        approved: false,
        comments: 'We can find alternative repair methods'
      }, 'plant-manager');

      expect(plantRejection.success).toBe(true);
      expect(plantRejection.data!.status).toBe('rejected');
      expect(plantRejection.data!.approvals.repair!.approved).toBe(true);
      expect(plantRejection.data!.approvals.plant!.approved).toBe(false);
    });
  });
});