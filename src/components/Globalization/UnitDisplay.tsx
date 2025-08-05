// Unit display component with automatic conversion

import React from 'react';
import { Box, Text, Tooltip } from '@chakra-ui/react';

// Error boundary to catch Chakra UI errors
class ErrorBoundary extends React.Component<{ fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log error here if needed
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
import { useUnits } from '../../hooks/useUnits.ts';
import { ConversionResult } from '../../types/globalization';

interface UnitDisplayProps {
  value: number;
  unit: string;
  measurementType: 'pressure' | 'length' | 'temperature';
  showOriginal?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fontWeight?: string;
  color?: string;
  precision?: number;
}

export const UnitDisplay: React.FC<UnitDisplayProps> = ({
  value,
  unit,
  measurementType,
  showOriginal = false,
  size = 'md',
  fontWeight = 'normal',
  color = 'inherit',
  precision
}) => {
  const { convertToPreferred, formatWithUnit } = useUnits();
  
  const conversion: ConversionResult = convertToPreferred(value, unit, measurementType);
  const needsConversion = conversion.fromUnit !== conversion.toUnit;
  
  // Determine precision based on measurement type if not specified
  const defaultPrecision = measurementType === 'temperature' ? 0 : 
                          measurementType === 'pressure' ? 0 : 1;
  const finalPrecision = precision !== undefined ? precision : defaultPrecision;
  
  const fontSize = size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px';
  const displayValue = formatWithUnit(conversion.convertedValue, conversion.toUnit, finalPrecision);
  const originalValue = formatWithUnit(conversion.originalValue, conversion.fromUnit, finalPrecision);

  if (!needsConversion) {
    return (
      <Text fontSize={fontSize} fontWeight={fontWeight} color={color}>
        {displayValue}
      </Text>
    );
  }

  const content = (
    <Box display="inline-block">
      <Text fontSize={fontSize} fontWeight={fontWeight} color={color}>
        {displayValue}
      </Text>
      {showOriginal && (
        <Text fontSize="12px" color="gray.500" mt={1}>
          (Originally {originalValue})
        </Text>
      )}
    </Box>
  );

  // Show tooltip with conversion info
  return (
    <Tooltip 
      label={`Converted from ${originalValue} (Rate: ${conversion.conversionRate.toFixed(4)})`}
      placement="top"
    >
      {content}
    </Tooltip>
  );
};

// Component for displaying valve specifications with unit conversion
interface ValveSpecDisplayProps {
  diameter: number;
  pressure: number;
  temperature: number;
  diameterUnit?: string;
  pressureUnit?: string;
  temperatureUnit?: string;
  showOriginal?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
}

export const ValveSpecDisplay: React.FC<ValveSpecDisplayProps> = ({
  diameter,
  pressure,
  temperature,
  diameterUnit = 'mm',
  pressureUnit = 'bar',
  temperatureUnit = 'C',
  showOriginal = false,
  size = 'md',
  layout = 'horizontal'
}) => {
  const specs = [
    { 
      label: 'Diameter', 
      value: diameter, 
      unit: diameterUnit, 
      type: 'length' as const 
    },
    { 
      label: 'Pressure', 
      value: pressure, 
      unit: pressureUnit, 
      type: 'pressure' as const 
    },
    { 
      label: 'Temperature', 
      value: temperature, 
      unit: temperatureUnit, 
      type: 'temperature' as const 
    }
  ];

  const containerProps = layout === 'horizontal' 
    ? { display: 'flex', gap: 4, flexWrap: 'wrap' as const }
    : { display: 'flex', flexDirection: 'column' as const, gap: 2 };

  return (
    <Box {...containerProps}>
      {specs.map((spec, index) => (
        <Box key={index} display="flex" alignItems="center" gap={2}>
          <Text fontSize="sm" color="gray.600" minW="80px">
            {spec.label}:
          </Text>
          <UnitDisplay
            value={spec.value}
            unit={spec.unit}
            measurementType={spec.type}
            showOriginal={showOriginal}
            size={size}
            fontWeight="semibold"
          />
        </Box>
      ))}
    </Box>
  );
};