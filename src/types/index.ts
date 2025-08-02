// Core data structure interfaces for the ValveChain application

export interface AuditLog {
  user: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface Valve {
  id: string;
  serial: string;
  manufacturer: string;
  model: string;
  location: string;
  status: string;
  lastServiceDate: string;
  plantOverrideMonths: number | null;
  processConditions: string;
}

// Blockchain valve data structure (from smart contract)
export interface BlockchainValve {
  serial: string;
  manufacturer: string;
  currentOwner: string;
  details: string;
  state: number;
}

export interface MaintenanceRecord {
  timestamp: number;
  performedBy: string;
  description: string;
  reportHash: string;
}

export interface RepairRequest {
  exists: boolean;
  requestedBy: string;
  contractor: string;
  amount: bigint;
  preTestHash: string;
  repairHash: string;
  postTestHash: string;
  complete: boolean;
  paid: boolean;
}

// Enum for valve states (matching the smart contract)
export enum ValveState {
  Manufactured = 0,
  AtDistributor = 1,
  AtPlant = 2,
  Installed = 3,
  NeedsRepair = 4,
  UnderRepair = 5,
  InService = 6
}

// Type for manufacturer intervals mapping
export interface ManufacturerIntervals {
  [manufacturer: string]: {
    [model: string]: number;
  };
}