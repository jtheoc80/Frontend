// Unit system selector component (HTML select for compatibility)

import React from 'react';
import {
  HStack,
  Text,
  Select
} from '@chakra-ui/react';
import { useCurrencyUnit } from '../../contexts/CurrencyUnitContext.tsx';
import { UNIT_SYSTEMS } from '../../types/units.ts';

interface UnitSelectorProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'solid' | 'ghost';
  showDetails?: boolean;
  disabled?: boolean;
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({
  size = 'md',
  variant = 'outline',
  showDetails = false,
  disabled = false
}) => {
  const { selectedUnitSystem, setUnitSystem, currentUnitSystem } = useCurrencyUnit();

  const handleUnitSystemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUnitSystem(event.target.value);
  };

  if (!currentUnitSystem) {
    return <Text fontSize="sm">Loading...</Text>;
  }

  return (
    <HStack spacing={2}>
      <Select
        value={selectedUnitSystem}
        onChange={handleUnitSystemChange}
        size={size}
        variant={variant}
        disabled={disabled}
        bg="whiteAlpha.200"
        color="white"
        _hover={{ bg: 'whiteAlpha.300' }}
        width="auto"
        minWidth="100px"
      >
        {UNIT_SYSTEMS.map((system) => (
          <option 
            key={system.code} 
            value={system.code}
            style={{ color: 'black' }}
          >
            {showDetails ? `${system.name} (${system.code})` : system.name}
          </option>
        ))}
      </Select>
    </HStack>
  );
};

export default UnitSelector;