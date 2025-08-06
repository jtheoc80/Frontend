// Currency and unit indicator components

import React from 'react';
import {
  HStack,
  Text,
  Badge,
  Box,
  Tooltip,
  Icon
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useCurrencyUnit } from '../../contexts/CurrencyUnitContext.tsx';
import { currencyService } from '../../services/currencyService.ts';

interface CurrencyIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const CurrencyIndicator: React.FC<CurrencyIndicatorProps> = ({
  size = 'sm',
  showTooltip = true
}) => {
  const { selectedCurrency, currentCurrency } = useCurrencyUnit();
  const rateStatus = currencyService.getRateStatus();
  
  if (!currentCurrency) return null;

  const indicator = (
    <HStack spacing={1}>
      <Badge 
        colorScheme={rateStatus.isOnline ? 'green' : 'orange'} 
        variant="subtle"
        size={size}
      >
        {currentCurrency.symbol} {selectedCurrency}
      </Badge>
      {!rateStatus.isOnline && (
        <Icon as={InfoOutlineIcon} boxSize={3} color="orange.500" />
      )}
    </HStack>
  );

  if (!showTooltip) return indicator;

  return (
    <Tooltip 
      label={`Currency: ${currentCurrency.name} • ${rateStatus.isOnline ? 'Live rates' : 'Offline rates'}`}
      aria-label="Currency info"
    >
      {indicator}
    </Tooltip>
  );
};

interface UnitIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const UnitIndicator: React.FC<UnitIndicatorProps> = ({
  size = 'sm',
  showTooltip = true
}) => {
  const { selectedUnitSystem, currentUnitSystem } = useCurrencyUnit();
  
  if (!currentUnitSystem) return null;

  const indicator = (
    <Badge 
      colorScheme="blue" 
      variant="subtle"
      size={size}
    >
      {currentUnitSystem.code}
    </Badge>
  );

  if (!showTooltip) return indicator;

  return (
    <Tooltip 
      label={`Units: ${currentUnitSystem.name} • ${currentUnitSystem.units.pressure}, ${currentUnitSystem.units.temperature}, ${currentUnitSystem.units.length}`}
      aria-label="Unit system info"
    >
      {indicator}
    </Tooltip>
  );
};

interface CombinedIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const CombinedIndicator: React.FC<CombinedIndicatorProps> = ({
  size = 'sm',
  showTooltip = true,
  orientation = 'horizontal'
}) => {
  const Container = orientation === 'horizontal' ? HStack : Box;
  const spacing = orientation === 'horizontal' ? { spacing: 2 } : { mt: 1 };

  return (
    <Container {...spacing}>
      <CurrencyIndicator size={size} showTooltip={showTooltip} />
      <UnitIndicator size={size} showTooltip={showTooltip} />
    </Container>
  );
};

export { CurrencyIndicator as default };