// TypeScript interfaces for valve tokenization and dashboard

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

// Extended interfaces for dashboard functionality
export type ValveStatus = 'pending_tokenization' | 'tokenized' | 'pending_order' | 'ordered' | 'pending_installation' | 'in_service' | 'scheduled_maintenance' | 'in_repair' | 'repaired';

export interface ValveAsset extends ValveDetails {
  id: string;
  tokenId?: string;
  status: ValveStatus;
  currentOwner?: string;
  location?: string;
  installDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  repairHistory?: RepairRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface RepairRecord {
  id: string;
  valveId: string;
  contractorId: string;
  contractorName: string;
  startDate: string;
  expectedCompletionDate?: string;
  completionDate?: string;
  description: string;
  status: 'requested' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number;
  preTestResults?: string;
  postTestResults?: string;
}

export interface Order {
  id: string;
  manufacturerId: string;
  distributorId: string;
  valveId: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  orderDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
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

// Dashboard-specific interfaces
export interface DashboardStats {
  totalValves: number;
  pendingTokenization: number;
  inService: number;
  inRepair: number;
  pendingOrders: number;
  scheduledMaintenance: number;
}