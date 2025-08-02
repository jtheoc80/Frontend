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

export interface ManufacturerInterval {
  [manufacturer: string]: {
    [model: string]: number;
  };
}

export interface ValveContextType {
  valves: Valve[];
  manufacturerIntervals: ManufacturerInterval;
  loading: boolean;
  error: string | null;
  fetchValves: () => Promise<void>;
  refreshData: () => Promise<void>;
}