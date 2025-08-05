// TypeScript interfaces for Purchase Order workflow stages

export enum POStage {
  DISTRIBUTION_TO_MANUFACTURER = 'DISTRIBUTION_TO_MANUFACTURER',
  PLANT_TO_DISTRIBUTION = 'PLANT_TO_DISTRIBUTION', 
  REPAIR_TO_PLANT = 'REPAIR_TO_PLANT'
}

// Base interface for common Purchase Order fields
export interface BasePurchaseOrder {
  orderId: string;
  timestamp: number;
  metadataHash: string;
  vendorAddress: string;
  buyerAddress: string;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'approved' | 'fulfilled' | 'cancelled';
}

// Stage 1: Distribution → Manufacturer (initial inventory orders)
export interface DistributionToManufacturerPO extends BasePurchaseOrder {
  stage: POStage.DISTRIBUTION_TO_MANUFACTURER;
  manufacturerDetails: {
    name: string;
    contactInfo: string;
    certifications: string[];
  };
  valveOrders: Array<{
    valveType: string;
    model: string;
    specifications: {
      diameter: number;
      pressure: number;
      temperature: number;
      material: string;
      connectionType: string;
    };
    quantity: number;
    unitPrice: number;
    deliveryDate: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  terms: {
    paymentTerms: string;
    warrantyMonths: number;
    deliveryTerms: string;
  };
}

// Stage 2: Plant → Distribution (requisition of valves)
export interface PlantToDistributionPO extends BasePurchaseOrder {
  stage: POStage.PLANT_TO_DISTRIBUTION;
  plantDetails: {
    plantId: string;
    name: string;
    location: string;
    contactPerson: string;
  };
  distributionCenter: {
    centerId: string;
    name: string;
    location: string;
  };
  requisitionItems: Array<{
    valveSerialNumber?: string; // For specific valve requests
    valveType: string;
    model: string;
    specifications: {
      diameter: number;
      pressure: number;
      temperature: number;
      material: string;
      connectionType: string;
    };
    quantity: number;
    unitPrice: number;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    applicationDetails: string;
  }>;
  requestedDeliveryDate: string;
  projectInfo: {
    projectId: string;
    description: string;
    budgetCode: string;
  };
}

// Stage 3: Repair → Plant (repair service invoicing)
export interface RepairToPlantPO extends BasePurchaseOrder {
  stage: POStage.REPAIR_TO_PLANT;
  repairServiceDetails: {
    serviceProviderId: string;
    name: string;
    certifications: string[];
    contactInfo: string;
  };
  plantDetails: {
    plantId: string;
    name: string;
    contactPerson: string;
  };
  repairServices: Array<{
    valveSerialNumber: string;
    serviceType: 'maintenance' | 'repair' | 'overhaul' | 'testing' | 'calibration';
    description: string;
    laborHours: number;
    laborRate: number;
    partsUsed: Array<{
      partNumber: string;
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
    serviceDate: string;
    completionDate: string;
    warrantyMonths: number;
  }>;
  invoiceDetails: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    taxRate: number;
    taxAmount: number;
    subtotal: number;
  };
}

// Request/Response types for API calls
export interface CreatePORequest<T extends BasePurchaseOrder> {
  purchaseOrder: T;
  signature?: string;
  nonce: number;
}

export interface CreatePOResponse {
  success: boolean;
  transactionHash?: string;
  orderId?: string;
  message: string;
  errors?: string[];
}

// Validation result interface
export interface POValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}