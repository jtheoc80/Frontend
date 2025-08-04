// Validation utilities for valve tokenization

import { ValveDetails, ValveSpecification } from '../types/valve';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate valve serial number
 */
export function validateSerialNumber(serialNumber: string): ValidationResult {
  const errors: string[] = [];
  
  if (!serialNumber || serialNumber.trim().length === 0) {
    errors.push('Serial number is required');
  } else if (serialNumber.trim().length < 3) {
    errors.push('Serial number must be at least 3 characters long');
  } else if (serialNumber.trim().length > 50) {
    errors.push('Serial number must be less than 50 characters');
  } else if (!/^[A-Za-z0-9\-_]+$/.test(serialNumber.trim())) {
    errors.push('Serial number can only contain letters, numbers, hyphens, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate valve specifications
 */
export function validateSpecifications(specs: ValveSpecification): ValidationResult {
  const errors: string[] = [];

  // Diameter validation
  if (!specs.diameter || specs.diameter <= 0) {
    errors.push('Diameter must be greater than 0');
  } else if (specs.diameter > 1000) {
    errors.push('Diameter must be less than 1000 inches');
  }

  // Pressure validation
  if (!specs.pressure || specs.pressure <= 0) {
    errors.push('Pressure rating must be greater than 0');
  } else if (specs.pressure > 10000) {
    errors.push('Pressure rating must be less than 10,000 PSI');
  }

  // Temperature validation
  if (specs.temperature < -273) {
    errors.push('Temperature must be above absolute zero (-273°C)');
  } else if (specs.temperature > 2000) {
    errors.push('Temperature must be less than 2000°C');
  }

  // Material validation
  if (!specs.material || specs.material.trim().length === 0) {
    errors.push('Material is required');
  } else if (specs.material.trim().length < 2) {
    errors.push('Material must be at least 2 characters long');
  }

  // Connection type validation
  if (!specs.connectionType || specs.connectionType.trim().length === 0) {
    errors.push('Connection type is required');
  } else if (specs.connectionType.trim().length < 2) {
    errors.push('Connection type must be at least 2 characters long');
  }

  // Flow coefficient validation (optional)
  if (specs.flowCoefficient !== undefined && specs.flowCoefficient < 0) {
    errors.push('Flow coefficient must be non-negative');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate manufacture date
 */
export function validateManufactureDate(dateString: string): ValidationResult {
  const errors: string[] = [];
  
  if (!dateString || dateString.trim().length === 0) {
    errors.push('Manufacture date is required');
    return { isValid: false, errors };
  }

  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    errors.push('Invalid date format');
    return { isValid: false, errors };
  }

  const now = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);
  
  if (date > oneYearFromNow) {
    errors.push('Manufacture date cannot be more than 1 year in the future');
  }

  const fiftyYearsAgo = new Date();
  fiftyYearsAgo.setFullYear(now.getFullYear() - 50);
  
  if (date < fiftyYearsAgo) {
    errors.push('Manufacture date cannot be more than 50 years ago');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate warranty months
 */
export function validateWarrantyMonths(warrantyMonths: number): ValidationResult {
  const errors: string[] = [];

  if (warrantyMonths < 0) {
    errors.push('Warranty months cannot be negative');
  } else if (warrantyMonths > 240) {
    errors.push('Warranty cannot exceed 20 years (240 months)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate complete valve details
 */
export function validateValveDetails(valveDetails: Partial<ValveDetails>): ValidationResult {
  const errors: string[] = [];

  // Serial number validation
  if (valveDetails.serialNumber !== undefined) {
    const serialResult = validateSerialNumber(valveDetails.serialNumber);
    errors.push(...serialResult.errors);
  } else {
    errors.push('Serial number is required');
  }

  // Type validation
  if (!valveDetails.type) {
    errors.push('Valve type is required');
  }

  // Manufacturer validation
  if (!valveDetails.manufacturer || valveDetails.manufacturer.trim().length === 0) {
    errors.push('Manufacturer is required');
  } else if (valveDetails.manufacturer.trim().length < 2) {
    errors.push('Manufacturer name must be at least 2 characters long');
  }

  // Model validation
  if (!valveDetails.model || valveDetails.model.trim().length === 0) {
    errors.push('Model is required');
  } else if (valveDetails.model.trim().length < 1) {
    errors.push('Model must be at least 1 character long');
  }

  // Specifications validation
  if (valveDetails.specifications) {
    const specsResult = validateSpecifications(valveDetails.specifications);
    errors.push(...specsResult.errors);
  } else {
    errors.push('Specifications are required');
  }

  // Manufacture date validation
  if (valveDetails.manufactureDate !== undefined) {
    const dateResult = validateManufactureDate(valveDetails.manufactureDate);
    errors.push(...dateResult.errors);
  } else {
    errors.push('Manufacture date is required');
  }

  // Warranty validation
  if (valveDetails.warrantyMonths !== undefined) {
    const warrantyResult = validateWarrantyMonths(valveDetails.warrantyMonths);
    errors.push(...warrantyResult.errors);
  } else {
    errors.push('Warranty months is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  
  return errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
}