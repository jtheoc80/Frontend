// Currency display component with automatic conversion

import React, { useState, useEffect } from 'react';
import { Box, Text, Spinner } from '@chakra-ui/react';
import { useCurrency } from '../../hooks/useCurrency.ts';
import { SupportedCurrency, LocalizedValue } from '../../types/globalization';

interface CurrencyDisplayProps {
  amount: number;
  currency: SupportedCurrency;
  showOriginal?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fontWeight?: string;
  color?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency,
  showOriginal = false,
  size = 'md',
  fontWeight = 'normal',
  color = 'inherit'
}) => {
  const { convertAndFormat, userCurrency, format, isLoadingRates } = useCurrency();
  const [convertedValue, setConvertedValue] = useState<LocalizedValue | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const performConversion = async () => {
      if (currency === userCurrency) {
        // No conversion needed
        setConvertedValue({
          value: amount,
          currency,
          displayValue: format(amount, currency)
        });
        return;
      }

      setIsConverting(true);
      try {
        const result = await convertAndFormat(amount, currency);
        setConvertedValue(result);
      } catch (error) {
        console.warn('Currency conversion failed:', error);
        // Fallback to original value
        setConvertedValue({
          value: amount,
          currency,
          displayValue: format(amount, currency)
        });
      } finally {
        setIsConverting(false);
      }
    };

    performConversion();
  }, [amount, currency, userCurrency, convertAndFormat, format]);

  const fontSize = size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px';

  if (isConverting || isLoadingRates) {
    return (
      <Box display="inline-flex" alignItems="center" gap={1}>
        <Spinner size="xs" />
        <Text fontSize={fontSize} fontWeight={fontWeight} color={color}>
          Converting...
        </Text>
      </Box>
    );
  }

  if (!convertedValue) {
    return (
      <Text fontSize={fontSize} fontWeight={fontWeight} color={color}>
        {format(amount, currency)}
      </Text>
    );
  }

  return (
    <Box display="inline-block">
      <Text fontSize={fontSize} fontWeight={fontWeight} color={color}>
        {convertedValue.displayValue}
      </Text>
      {showOriginal && currency !== userCurrency && (
        <Text fontSize="12px" color="gray.500" mt={1}>
          (Originally {format(amount, currency)})
        </Text>
      )}
    </Box>
  );
};

// Component for displaying multiple currency values
interface CurrencyListProps {
  values: Array<{ amount: number; currency: SupportedCurrency; label?: string }>;
  showOriginal?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CurrencyList: React.FC<CurrencyListProps> = ({
  values,
  showOriginal = false,
  size = 'md'
}) => {
  return (
    <Box>
      {values.map((item, index) => (
        <Box key={index} mb={2}>
          {item.label && (
            <Text fontSize="sm" color="gray.600" mb={1}>
              {item.label}
            </Text>
          )}
          <CurrencyDisplay
            amount={item.amount}
            currency={item.currency}
            showOriginal={showOriginal}
            size={size}
          />
        </Box>
      ))}
    </Box>
  );
};