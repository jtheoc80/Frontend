// Currency selector component (ultra-simplified)

import React from 'react';
import {
  HStack,
  Text,
  Badge
} from '@chakra-ui/react';
import { useCurrencyUnit } from '../../contexts/CurrencyUnitContext.tsx';
import { currencyService } from '../../services/currencyService.ts';

interface CurrencySelectorProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'solid' | 'ghost';
  showFullName?: boolean;
  disabled?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  size = 'md',
  variant = 'outline',
  showFullName = false,
  disabled = false
}) => {
  const { selectedCurrency, currentCurrency } = useCurrencyUnit();

  if (!currentCurrency) {
    return <Text fontSize="sm">Loading...</Text>;
  }

  const rateStatus = currencyService.getRateStatus();

  return (
    <HStack spacing={2}>
      <Badge 
        colorScheme={rateStatus.isOnline ? 'green' : 'orange'} 
        variant="subtle"
        size={size}
      >
        {currentCurrency.symbol} {selectedCurrency}
      </Badge>
    </HStack>
  );
};

export default CurrencySelector;