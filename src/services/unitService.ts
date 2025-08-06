// Unit conversion service for valve measurements

import { Unit, UnitSystem, UnitConversion, UnitCategory, SUPPORTED_UNITS, UNIT_SYSTEMS, getUnitByCode, getUnitSystemByCode } from '../types/units.ts';

class UnitService {
  // Conversion factors to base units (metric system as base)
  private conversionFactors: Record<string, Record<string, number>> = {
    // Pressure conversions (to Pa)
    pressure: {
      'Pa': 1.0,
      'kPa': 1000.0,
      'MPa': 1000000.0,
      'bar': 100000.0,
      'PSI': 6894.76,
      'atm': 101325.0
    },
    // Temperature conversions (special handling required)
    temperature: {
      'C': 1.0, // Base unit
      'K': 1.0, // Will be handled specially
      'F': 1.0  // Will be handled specially
    },
    // Length conversions (to mm)
    length: {
      'mm': 1.0,
      'cm': 10.0,
      'm': 1000.0,
      'in': 25.4,
      'ft': 304.8
    },
    // Volume conversions (to L)
    volume: {
      'L': 1.0,
      'gal': 3.78541, // US gallon
      'm³': 1000.0,
      'ft³': 28.3168
    },
    // Flow conversions (to L/min)
    flow: {
      'LPM': 1.0,
      'GPM': 3.78541,
      'm³/s': 60000.0,
      'm³/h': 1000.0
    }
  };

  constructor() {
    // Initialize service
    console.log('Unit service initialized with conversion support for', Object.keys(this.conversionFactors).length, 'categories');
  }

  /**
   * Convert value between units of the same category
   */
  convertUnit(value: number, fromUnit: string, toUnit: string): UnitConversion | null {
    const fromUnitObj = getUnitByCode(fromUnit);
    const toUnitObj = getUnitByCode(toUnit);

    if (!fromUnitObj || !toUnitObj || fromUnitObj.category !== toUnitObj.category) {
      return null;
    }

    const category = fromUnitObj.category;
    let convertedValue: number;

    // Special handling for temperature
    if (category === 'temperature') {
      convertedValue = this.convertTemperature(value, fromUnit, toUnit);
    } else {
      // Standard conversion through base unit
      const fromFactor = this.conversionFactors[category]?.[fromUnit];
      const toFactor = this.conversionFactors[category]?.[toUnit];

      if (fromFactor === undefined || toFactor === undefined) {
        return null;
      }

      // Convert to base unit, then to target unit
      const baseValue = value * fromFactor;
      convertedValue = baseValue / toFactor;
    }

    return {
      fromUnit,
      toUnit,
      value,
      convertedValue,
      category
    };
  }

  /**
   * Special temperature conversion handling
   */
  private convertTemperature(value: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return value;

    // First convert to Celsius as intermediate
    let celsius: number;
    switch (fromUnit) {
      case 'C':
        celsius = value;
        break;
      case 'F':
        celsius = (value - 32) * 5 / 9;
        break;
      case 'K':
        celsius = value - 273.15;
        break;
      default:
        return value; // Unknown unit
    }

    // Then convert from Celsius to target
    switch (toUnit) {
      case 'C':
        return celsius;
      case 'F':
        return celsius * 9 / 5 + 32;
      case 'K':
        return celsius + 273.15;
      default:
        return celsius; // Unknown unit
    }
  }

  /**
   * Convert multiple values using a unit system
   */
  convertToUnitSystem(values: Record<string, number>, currentUnits: Record<string, string>, targetSystem: UnitSystem): Record<string, { value: number; unit: string }> {
    const result: Record<string, { value: number; unit: string }> = {};

    Object.entries(values).forEach(([key, value]) => {
      const currentUnit = currentUnits[key];
      const targetUnit = targetSystem.units[key as keyof typeof targetSystem.units];

      if (currentUnit && targetUnit) {
        const conversion = this.convertUnit(value, currentUnit, targetUnit);
        result[key] = {
          value: conversion?.convertedValue ?? value,
          unit: targetUnit
        };
      } else {
        result[key] = { value, unit: currentUnit || '' };
      }
    });

    return result;
  }

  /**
   * Get conversion factor between two units
   */
  getConversionFactor(fromUnit: string, toUnit: string): number | null {
    const conversion = this.convertUnit(1, fromUnit, toUnit);
    return conversion?.convertedValue || null;
  }

  /**
   * Get all supported units for a category
   */
  getUnitsForCategory(category: UnitCategory): Unit[] {
    return SUPPORTED_UNITS.filter(unit => unit.category === category);
  }

  /**
   * Get all unit systems
   */
  getUnitSystems(): UnitSystem[] {
    return UNIT_SYSTEMS;
  }

  /**
   * Check if conversion is possible between two units
   */
  canConvert(fromUnit: string, toUnit: string): boolean {
    const fromUnitObj = getUnitByCode(fromUnit);
    const toUnitObj = getUnitByCode(toUnit);
    
    return fromUnitObj !== undefined && 
           toUnitObj !== undefined && 
           fromUnitObj.category === toUnitObj.category;
  }

  /**
   * Get unit display name with value
   */
  formatUnitValue(value: number, unitCode: string): string {
    const unit = getUnitByCode(unitCode);
    if (!unit) return value.toString();

    let precision = 1;
    if (unit.category === 'pressure' && value > 1000) precision = 0;
    else if (unit.category === 'length' && unitCode === 'mm') precision = 0;
    else if (unit.category === 'temperature') precision = 1;
    else if (value > 100) precision = 0;
    else precision = 2;

    return `${value.toFixed(precision)} ${unit.symbol}`;
  }

  /**
   * Convert valve specifications to target unit system
   */
  convertValveSpecs(specs: any, fromSystem: string, toSystem: string): any {
    const fromUnitSystem = getUnitSystemByCode(fromSystem);
    const toUnitSystem = getUnitSystemByCode(toSystem);

    if (!fromUnitSystem || !toUnitSystem) {
      return specs; // Return unchanged if systems not found
    }

    const convertedSpecs = { ...specs };

    // Convert diameter
    if (specs.diameter !== undefined) {
      const diameterConversion = this.convertUnit(
        specs.diameter, 
        fromUnitSystem.units.length, 
        toUnitSystem.units.length
      );
      if (diameterConversion) {
        convertedSpecs.diameter = diameterConversion.convertedValue;
      }
    }

    // Convert pressure
    if (specs.pressure !== undefined) {
      const pressureConversion = this.convertUnit(
        specs.pressure,
        fromUnitSystem.units.pressure,
        toUnitSystem.units.pressure
      );
      if (pressureConversion) {
        convertedSpecs.pressure = pressureConversion.convertedValue;
      }
    }

    // Convert temperature
    if (specs.temperature !== undefined) {
      const tempConversion = this.convertUnit(
        specs.temperature,
        fromUnitSystem.units.temperature,
        toUnitSystem.units.temperature
      );
      if (tempConversion) {
        convertedSpecs.temperature = tempConversion.convertedValue;
      }
    }

    return convertedSpecs;
  }

  /**
   * Get reasonable precision for unit category
   */
  getPrecisionForCategory(category: UnitCategory): number {
    switch (category) {
      case 'temperature': return 1;
      case 'pressure': return 0;
      case 'length': return 2;
      case 'volume': return 2;
      case 'flow': return 1;
      default: return 2;
    }
  }
}

// Export singleton instance
export const unitService = new UnitService();
export default unitService;