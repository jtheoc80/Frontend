// Tests for unit service functionality

import { unitService } from '../../services/unitService';
import { SUPPORTED_UNITS, UNIT_SYSTEMS, UnitCategory } from '../../types/units';

describe('UnitService', () => {
  describe('Unit Systems', () => {
    test('should return all unit systems', () => {
      const systems = unitService.getUnitSystems();
      expect(systems).toEqual(UNIT_SYSTEMS);
      expect(systems.length).toBeGreaterThanOrEqual(3);
    });

    test('should have all required units for each system', () => {
      const systems = unitService.getUnitSystems();
      systems.forEach(system => {
        expect(system).toHaveProperty('units.pressure');
        expect(system).toHaveProperty('units.temperature');
        expect(system).toHaveProperty('units.length');
        expect(system).toHaveProperty('units.volume');
        expect(system).toHaveProperty('units.flow');
      });
    });
  });

  describe('Unit Categories', () => {
    test('should return units for each category', () => {
      const categories: UnitCategory[] = ['pressure', 'temperature', 'length', 'volume', 'flow'];
      
      categories.forEach(category => {
        const units = unitService.getUnitsForCategory(category);
        expect(units.length).toBeGreaterThan(0);
        units.forEach(unit => {
          expect(unit.category).toBe(category);
        });
      });
    });
  });

  describe('Unit Conversion', () => {
    test('should convert same units correctly', () => {
      const conversion = unitService.convertUnit(100, 'PSI', 'PSI');
      expect(conversion).not.toBeNull();
      expect(conversion!.value).toBe(100);
      expect(conversion!.convertedValue).toBe(100);
      expect(conversion!.fromUnit).toBe('PSI');
      expect(conversion!.toUnit).toBe('PSI');
    });

    test('should convert pressure units correctly', () => {
      const conversion = unitService.convertUnit(100, 'PSI', 'bar');
      expect(conversion).not.toBeNull();
      expect(conversion!.convertedValue).toBeGreaterThan(0);
      expect(conversion!.convertedValue).not.toBe(100);
    });

    test('should convert temperature units correctly', () => {
      // Test Celsius to Fahrenheit
      const conversion = unitService.convertUnit(0, 'C', 'F');
      expect(conversion).not.toBeNull();
      expect(conversion!.convertedValue).toBe(32);
      
      // Test Celsius to Kelvin
      const conversionK = unitService.convertUnit(0, 'C', 'K');
      expect(conversionK).not.toBeNull();
      expect(Math.abs(conversionK!.convertedValue - 273.15)).toBeLessThan(0.01);
    });

    test('should convert length units correctly', () => {
      // Test inches to millimeters
      const conversion = unitService.convertUnit(1, 'in', 'mm');
      expect(conversion).not.toBeNull();
      expect(Math.abs(conversion!.convertedValue - 25.4)).toBeLessThan(0.01);
    });

    test('should return null for invalid unit conversions', () => {
      // Different categories
      const conversion = unitService.convertUnit(100, 'PSI', 'C');
      expect(conversion).toBeNull();
      
      // Invalid units
      const invalidConversion = unitService.convertUnit(100, 'INVALID', 'PSI');
      expect(invalidConversion).toBeNull();
    });
  });

  describe('Conversion Validation', () => {
    test('should validate convertible units', () => {
      expect(unitService.canConvert('PSI', 'bar')).toBe(true);
      expect(unitService.canConvert('C', 'F')).toBe(true);
      expect(unitService.canConvert('in', 'mm')).toBe(true);
    });

    test('should reject non-convertible units', () => {
      expect(unitService.canConvert('PSI', 'C')).toBe(false);
      expect(unitService.canConvert('INVALID', 'PSI')).toBe(false);
    });
  });

  describe('Conversion Factors', () => {
    test('should return valid conversion factors', () => {
      const factor = unitService.getConversionFactor('in', 'mm');
      expect(factor).not.toBeNull();
      expect(factor!).toBeCloseTo(25.4, 2);
    });

    test('should return 1 for same unit conversion', () => {
      const factor = unitService.getConversionFactor('PSI', 'PSI');
      expect(factor).toBe(1);
    });

    test('should return null for invalid conversions', () => {
      const factor = unitService.getConversionFactor('PSI', 'C');
      expect(factor).toBeNull();
    });
  });

  describe('Value Formatting', () => {
    test('should format unit values correctly', () => {
      const formatted = unitService.formatUnitValue(100.5, 'PSI');
      expect(formatted).toContain('101'); // Rounds to nearest integer for pressure
      expect(formatted).toContain('psi');
    });

    test('should handle temperature formatting', () => {
      const formatted = unitService.formatUnitValue(25.5, 'C');
      expect(formatted).toContain('25.5');
      expect(formatted).toContain('°C');
    });

    test('should handle invalid unit codes', () => {
      const formatted = unitService.formatUnitValue(100, 'INVALID');
      expect(formatted).toBe('100');
    });
  });

  describe('Valve Specifications Conversion', () => {
    test('should convert valve specs between unit systems', () => {
      const specs = {
        diameter: 6,
        pressure: 1500,
        temperature: 200
      };

      const converted = unitService.convertValveSpecs(specs, 'IMPERIAL', 'METRIC');
      expect(converted).toBeDefined();
      expect(converted.diameter).not.toBe(specs.diameter);
      expect(converted.pressure).not.toBe(specs.pressure);
      expect(converted.temperature).not.toBe(specs.temperature);
    });

    test('should return unchanged specs for invalid systems', () => {
      const specs = {
        diameter: 6,
        pressure: 1500,
        temperature: 200
      };

      const converted = unitService.convertValveSpecs(specs, 'INVALID', 'METRIC');
      expect(converted).toEqual(specs);
    });
  });

  describe('Precision', () => {
    test('should return appropriate precision for categories', () => {
      expect(unitService.getPrecisionForCategory('temperature')).toBe(1);
      expect(unitService.getPrecisionForCategory('pressure')).toBe(0);
      expect(unitService.getPrecisionForCategory('length')).toBe(2);
      expect(unitService.getPrecisionForCategory('volume')).toBe(2);
      expect(unitService.getPrecisionForCategory('flow')).toBe(1);
    });
  });
});