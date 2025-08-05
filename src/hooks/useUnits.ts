// Hook for unit conversion and formatting

import { useGlobalization } from '../contexts/GlobalizationContext.tsx';
import { unitConversionService } from '../services/unitConversionService.ts';
import { ConversionResult } from '../types/globalization';

export const useUnits = () => {
  const { preferences } = useGlobalization();

  /**
   * Convert a value to user's preferred unit system
   */
  const convertToPreferred = (
    value: number,
    currentUnit: string,
    measurementType: 'pressure' | 'length' | 'temperature'
  ): ConversionResult => {
    try {
      return unitConversionService.convertToPreferredUnits(
        value,
        currentUnit,
        measurementType,
        preferences.unitSystem
      );
    } catch (error) {
      console.warn('Unit conversion failed:', error);
      return {
        originalValue: value,
        convertedValue: value,
        fromUnit: currentUnit,
        toUnit: currentUnit,
        conversionRate: 1
      };
    }
  };

  /**
   * Get the appropriate units for current user preference
   */
  const getPreferredUnits = () => {
    return unitConversionService.getUnitsForSystem(preferences.unitSystem);
  };

  /**
   * Convert pressure value
   */
  const convertPressure = (value: number, fromUnit: string, toUnit?: string): ConversionResult => {
    const targetUnit = toUnit || getPreferredUnits().pressure;
    try {
      return unitConversionService.convertPressure(value, fromUnit, targetUnit);
    } catch (error) {
      console.warn('Pressure conversion failed:', error);
      return {
        originalValue: value,
        convertedValue: value,
        fromUnit,
        toUnit: targetUnit,
        conversionRate: 1
      };
    }
  };

  /**
   * Convert length/diameter value
   */
  const convertLength = (value: number, fromUnit: string, toUnit?: string): ConversionResult => {
    const targetUnit = toUnit || getPreferredUnits().length;
    try {
      return unitConversionService.convertLength(value, fromUnit, targetUnit);
    } catch (error) {
      console.warn('Length conversion failed:', error);
      return {
        originalValue: value,
        convertedValue: value,
        fromUnit,
        toUnit: targetUnit,
        conversionRate: 1
      };
    }
  };

  /**
   * Convert temperature value
   */
  const convertTemperature = (value: number, fromUnit: string, toUnit?: string): ConversionResult => {
    const targetUnit = toUnit || getPreferredUnits().temperature;
    try {
      return unitConversionService.convertTemperature(value, fromUnit, targetUnit);
    } catch (error) {
      console.warn('Temperature conversion failed:', error);
      return {
        originalValue: value,
        convertedValue: value,
        fromUnit,
        toUnit: targetUnit,
        conversionRate: 1
      };
    }
  };

  /**
   * Format a value with its unit
   */
  const formatWithUnit = (value: number, unit: string, decimalPlaces: number = 2): string => {
    const formattedValue = value.toFixed(decimalPlaces);
    return `${formattedValue} ${unit}`;
  };

  /**
   * Check if current unit system is metric
   */
  const isMetric = (): boolean => {
    return preferences.unitSystem === 'metric';
  };

  /**
   * Check if current unit system is imperial
   */
  const isImperial = (): boolean => {
    return preferences.unitSystem === 'imperial';
  };

  /**
   * Get unit system display name
   */
  const getUnitSystemName = (): string => {
    return preferences.unitSystem === 'metric' ? 'Metric' : 'Imperial';
  };

  return {
    convertToPreferred,
    getPreferredUnits,
    convertPressure,
    convertLength,
    convertTemperature,
    formatWithUnit,
    isMetric,
    isImperial,
    getUnitSystemName,
    userUnitSystem: preferences.unitSystem
  };
};

/**
 * Hook for converting valve specifications to user's preferred units
 */
export const useValveSpecificationUnits = () => {
  const { convertPressure, convertLength, convertTemperature, formatWithUnit } = useUnits();

  /**
   * Convert all valve specifications to user's preferred units
   */
  const convertValveSpecs = (specs: {
    diameter: number;
    pressure: number;
    temperature: number;
    diameterUnit?: string;
    pressureUnit?: string;
    temperatureUnit?: string;
  }) => {
    const diameterResult = convertLength(
      specs.diameter, 
      specs.diameterUnit || 'mm'
    );
    
    const pressureResult = convertPressure(
      specs.pressure, 
      specs.pressureUnit || 'bar'
    );
    
    const temperatureResult = convertTemperature(
      specs.temperature, 
      specs.temperatureUnit || 'C'
    );

    return {
      diameter: {
        ...diameterResult,
        formatted: formatWithUnit(diameterResult.convertedValue, diameterResult.toUnit, 1)
      },
      pressure: {
        ...pressureResult,
        formatted: formatWithUnit(pressureResult.convertedValue, pressureResult.toUnit, 0)
      },
      temperature: {
        ...temperatureResult,
        formatted: formatWithUnit(temperatureResult.convertedValue, temperatureResult.toUnit, 0)
      }
    };
  };

  return {
    convertValveSpecs
  };
};