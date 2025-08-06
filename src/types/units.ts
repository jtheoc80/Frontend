// Types for multi-unit support

export interface Unit {
  code: string;
  name: string;
  symbol: string;
  category: UnitCategory;
}

export type UnitCategory = 'pressure' | 'temperature' | 'length' | 'volume' | 'flow';

export interface UnitSystem {
  name: string;
  code: string;
  units: {
    pressure: string;
    temperature: string;
    length: string;
    volume: string;
    flow: string;
  };
}

export interface UnitConversion {
  fromUnit: string;
  toUnit: string;
  value: number;
  convertedValue: number;
  category: UnitCategory;
}

// Supported unit systems
export const UNIT_SYSTEMS: UnitSystem[] = [
  {
    name: 'Imperial/US',
    code: 'IMPERIAL',
    units: {
      pressure: 'PSI',
      temperature: 'F',
      length: 'in',
      volume: 'gal',
      flow: 'GPM'
    }
  },
  {
    name: 'Metric',
    code: 'METRIC',
    units: {
      pressure: 'bar',
      temperature: 'C',
      length: 'mm',
      volume: 'L',
      flow: 'LPM'
    }
  },
  {
    name: 'SI',
    code: 'SI',
    units: {
      pressure: 'Pa',
      temperature: 'K',
      length: 'm',
      volume: 'm³',
      flow: 'm³/s'
    }
  }
];

// All supported units with conversion factors
export const SUPPORTED_UNITS: Unit[] = [
  // Pressure units
  { code: 'PSI', name: 'Pounds per Square Inch', symbol: 'psi', category: 'pressure' },
  { code: 'bar', name: 'Bar', symbol: 'bar', category: 'pressure' },
  { code: 'Pa', name: 'Pascal', symbol: 'Pa', category: 'pressure' },
  { code: 'kPa', name: 'Kilopascal', symbol: 'kPa', category: 'pressure' },
  { code: 'MPa', name: 'Megapascal', symbol: 'MPa', category: 'pressure' },
  { code: 'atm', name: 'Atmosphere', symbol: 'atm', category: 'pressure' },
  
  // Temperature units
  { code: 'C', name: 'Celsius', symbol: '°C', category: 'temperature' },
  { code: 'F', name: 'Fahrenheit', symbol: '°F', category: 'temperature' },
  { code: 'K', name: 'Kelvin', symbol: 'K', category: 'temperature' },
  
  // Length units
  { code: 'in', name: 'Inches', symbol: 'in', category: 'length' },
  { code: 'mm', name: 'Millimeters', symbol: 'mm', category: 'length' },
  { code: 'cm', name: 'Centimeters', symbol: 'cm', category: 'length' },
  { code: 'm', name: 'Meters', symbol: 'm', category: 'length' },
  { code: 'ft', name: 'Feet', symbol: 'ft', category: 'length' },
  
  // Volume units
  { code: 'L', name: 'Liters', symbol: 'L', category: 'volume' },
  { code: 'gal', name: 'Gallons', symbol: 'gal', category: 'volume' },
  { code: 'm³', name: 'Cubic Meters', symbol: 'm³', category: 'volume' },
  { code: 'ft³', name: 'Cubic Feet', symbol: 'ft³', category: 'volume' },
  
  // Flow units
  { code: 'GPM', name: 'Gallons per Minute', symbol: 'GPM', category: 'flow' },
  { code: 'LPM', name: 'Liters per Minute', symbol: 'L/min', category: 'flow' },
  { code: 'm³/s', name: 'Cubic Meters per Second', symbol: 'm³/s', category: 'flow' },
  { code: 'm³/h', name: 'Cubic Meters per Hour', symbol: 'm³/h', category: 'flow' },
];

export const DEFAULT_UNIT_SYSTEM = 'IMPERIAL';

// Helper functions
export const getUnitSystemByCode = (code: string): UnitSystem | undefined => {
  return UNIT_SYSTEMS.find(system => system.code === code);
};

export const getUnitByCode = (code: string): Unit | undefined => {
  return SUPPORTED_UNITS.find(unit => unit.code === code);
};

export const getUnitsByCategory = (category: UnitCategory): Unit[] => {
  return SUPPORTED_UNITS.filter(unit => unit.category === category);
};

export const formatUnitValue = (value: number, unitCode: string): string => {
  const unit = getUnitByCode(unitCode);
  if (!unit) return `${value}`;
  
  // Format based on unit type and reasonable precision
  let formattedValue: string;
  
  if (unit.category === 'temperature' || value < 10) {
    formattedValue = value.toFixed(1);
  } else if (value < 100) {
    formattedValue = value.toFixed(2);
  } else {
    formattedValue = value.toFixed(0);
  }
  
  return `${formattedValue} ${unit.symbol}`;
};