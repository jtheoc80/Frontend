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