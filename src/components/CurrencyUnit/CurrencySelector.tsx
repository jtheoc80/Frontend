// Currency selector component (HTML select for compatibility)

import React from 'react';
import {
  HStack,
  Text,
  Badge,
  Select
} from '@chakra-ui/react';
import { useCurrencyUnit } from '../../contexts/CurrencyUnitContext.tsx';
import { SUPPORTED_CURRENCIES } from '../../types/currency.ts';
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
  const { selectedCurrency, setCurrency, currentCurrency } = useCurrencyUnit();

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

  if (!currentCurrency) {
    return <Text fontSize="sm">Loading...</Text>;
  }

  const rateStatus = currencyService.getRateStatus();

  return (
    <HStack spacing={2}>
      <Select
        value={selectedCurrency}
        onChange={handleCurrencyChange}
        size={size}
        variant={variant}
        disabled={disabled}
        bg="whiteAlpha.200"
        color="white"
        _hover={{ bg: 'whiteAlpha.300' }}
        width="auto"
        minWidth="80px"
      >
        {SUPPORTED_CURRENCIES.map((currency) => (
          <option 
            key={currency.code} 
            value={currency.code}
            style={{ color: 'black' }}
          >
            {showFullName ? `${currency.symbol} ${currency.code} - ${currency.name}` : `${currency.symbol} ${currency.code}`}
          </option>
        ))}
      </Select>
      {!rateStatus.isOnline && (
        <Badge colorScheme="orange" size="sm">
          Offline
        </Badge>
      )}
    </HStack>
  );
};

export default CurrencySelector;