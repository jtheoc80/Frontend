// Service for unit conversions

import { UnitSystem, ConversionResult } from '../types/globalization';

class UnitConversionService {
  private static instance: UnitConversionService;

  private constructor() {}

  public static getInstance(): UnitConversionService {
    if (!UnitConversionService.instance) {
      UnitConversionService.instance = new UnitConversionService();
    }
    return UnitConversionService.instance;
  }

  // Pressure conversions
  public convertPressure(value: number, fromUnit: string, toUnit: string): ConversionResult {
    let valueInBar: number;
    
    // Convert to bar first (metric base unit)
    switch (fromUnit.toLowerCase()) {
      case 'bar':
        valueInBar = value;
        break;
      case 'kpa':
        valueInBar = value / 100;
        break;
      case 'mpa':
        valueInBar = value * 10;
        break;
      case 'psi':
      case 'psig':
        valueInBar = value / 14.5038;
        break;
      default:
        throw new Error(`Unsupported pressure unit: ${fromUnit}`);
    }

    // Convert from bar to target unit
    let convertedValue: number;
    switch (toUnit.toLowerCase()) {
      case 'bar':
        convertedValue = valueInBar;
        break;
      case 'kpa':
        convertedValue = valueInBar * 100;
        break;
      case 'mpa':
        convertedValue = valueInBar / 10;
        break;
      case 'psi':
      case 'psig':
        convertedValue = valueInBar * 14.5038;
        break;
      default:
        throw new Error(`Unsupported pressure unit: ${toUnit}`);
    }

    const conversionRate = convertedValue / value;
    
    return {
      originalValue: value,
      convertedValue: Math.round(convertedValue * 100) / 100,
      fromUnit,
      toUnit,
      conversionRate
    };
  }

  // Length/diameter conversions
  public convertLength(value: number, fromUnit: string, toUnit: string): ConversionResult {
    let valueInMm: number;
    
    // Convert to mm first (metric base unit)
    switch (fromUnit.toLowerCase()) {
      case 'mm':
        valueInMm = value;
        break;
      case 'cm':
        valueInMm = value * 10;
        break;
      case 'm':
        valueInMm = value * 1000;
        break;
      case 'in':
        valueInMm = value * 25.4;
        break;
      case 'ft':
        valueInMm = value * 304.8;
        break;
      default:
        throw new Error(`Unsupported length unit: ${fromUnit}`);
    }

    // Convert from mm to target unit
    let convertedValue: number;
    switch (toUnit.toLowerCase()) {
      case 'mm':
        convertedValue = valueInMm;
        break;
      case 'cm':
        convertedValue = valueInMm / 10;
        break;
      case 'm':
        convertedValue = valueInMm / 1000;
        break;
      case 'in':
        convertedValue = valueInMm / 25.4;
        break;
      case 'ft':
        convertedValue = valueInMm / 304.8;
        break;
      default:
        throw new Error(`Unsupported length unit: ${toUnit}`);
    }

    const conversionRate = convertedValue / value;
    
    return {
      originalValue: value,
      convertedValue: Math.round(convertedValue * 1000) / 1000, // 3 decimal places for precision
      fromUnit,
      toUnit,
      conversionRate
    };
  }

  // Temperature conversions
  public convertTemperature(value: number, fromUnit: string, toUnit: string): ConversionResult {
    let convertedValue: number;
    
    if (fromUnit.toLowerCase() === toUnit.toLowerCase()) {
      convertedValue = value;
    } else if (fromUnit.toLowerCase() === 'c' && toUnit.toLowerCase() === 'f') {
      convertedValue = (value * 9/5) + 32;
    } else if (fromUnit.toLowerCase() === 'f' && toUnit.toLowerCase() === 'c') {
      convertedValue = (value - 32) * 5/9;
    } else {
      throw new Error(`Unsupported temperature conversion: ${fromUnit} to ${toUnit}`);
    }

    const conversionRate = fromUnit.toLowerCase() === toUnit.toLowerCase() ? 1 : 
                          (fromUnit.toLowerCase() === 'c' ? 1.8 : 5/9);
    
    return {
      originalValue: value,
      convertedValue: Math.round(convertedValue * 10) / 10, // 1 decimal place
      fromUnit,
      toUnit,
      conversionRate
    };
  }

  // Get appropriate units for unit system
  public getUnitsForSystem(unitSystem: UnitSystem) {
    if (unitSystem === 'metric') {
      return {
        pressure: 'bar',
        length: 'mm',
        temperature: 'C',
        flow: 'L/min'
      };
    } else {
      return {
        pressure: 'psi',
        length: 'in',
        temperature: 'F',
        flow: 'gpm'
      };
    }
  }

  // Convert value based on unit system preference
  public convertToPreferredUnits(
    value: number, 
    currentUnit: string, 
    measurementType: 'pressure' | 'length' | 'temperature',
    preferredSystem: UnitSystem
  ): ConversionResult {
    const preferredUnits = this.getUnitsForSystem(preferredSystem);
    let targetUnit: string;

    switch (measurementType) {
      case 'pressure':
        targetUnit = preferredUnits.pressure;
        return this.convertPressure(value, currentUnit, targetUnit);
      case 'length':
        targetUnit = preferredUnits.length;
        return this.convertLength(value, currentUnit, targetUnit);
      case 'temperature':
        targetUnit = preferredUnits.temperature;
        return this.convertTemperature(value, currentUnit, targetUnit);
      default:
        throw new Error(`Unsupported measurement type: ${measurementType}`);
    }
  }
}

export const unitConversionService = UnitConversionService.getInstance();