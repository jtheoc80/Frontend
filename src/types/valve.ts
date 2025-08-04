// TypeScript interfaces for valve tokenization

export interface ValveSpecification {
  diameter: number;
  pressure: number;
  temperature: number;
  material: string;
  connectionType: string;
  flowCoefficient?: number;
}

export interface ValveDetails {
  serialNumber: string;
  type: 'gate' | 'ball' | 'globe' | 'butterfly' | 'check' | 'needle' | 'plug';
  manufacturer: string;
  model: string;
  specifications: ValveSpecification;
  certifications: string[];
  manufactureDate: string;
  warrantyMonths: number;
}

export interface TokenizeValveRequest {
  valveDetails: ValveDetails;
  manufacturerId: string;
}

export interface TokenizeValveResponse {
  success: boolean;
  tokenId?: string;
  transactionHash?: string;
  valveId?: string;
  message: string;
  errors?: string[];
}

export interface ManufacturerAuth {
  id: string;
  name: string;
  isAuthenticated: boolean;
  walletAddress?: string;
  permissions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}

// Termination workflow types
export interface TerminationRequest {
  id: string;
  valveSerialNumber: string;
  requestedBy: string; // User who requested termination (repair role)
  reason: 'high_repair_cost' | 'beyond_economical_repair' | 'other';
  customReason?: string; // If reason is 'other'
  repairCost?: number; // Cost of repair
  newValveCost?: number; // Cost of new valve
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvals: {
    repair: TerminationApproval | null;
    plant: TerminationApproval | null;
  };
}

export interface TerminationApproval {
  approvedBy: string;
  approvalDate: string;
  approved: boolean;
  comments?: string;
}

export interface TerminationRequestData {
  valveSerialNumber: string;
  reason: 'high_repair_cost' | 'beyond_economical_repair' | 'other';
  customReason?: string;
  repairCost?: number;
  newValveCost?: number;
}

export interface TerminationApprovalData {
  terminationRequestId: string;
  role: 'repair' | 'plant';
  approved: boolean;
  comments?: string;
}