// Unit system selector component (ultra-simplified)

import React from 'react';
import {
  HStack,
  Text,
  Badge
} from '@chakra-ui/react';
import { useCurrencyUnit } from '../../contexts/CurrencyUnitContext.tsx';

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
  const { currentUnitSystem } = useCurrencyUnit();

  if (!currentUnitSystem) {
    return <Text fontSize="sm">Loading...</Text>;
  }

  return (
    <HStack spacing={2}>
      <Badge 
        colorScheme="blue" 
        variant="subtle"
        size={size}
      >
        {currentUnitSystem.code}
      </Badge>
    </HStack>
  );
};

export default UnitSelector;