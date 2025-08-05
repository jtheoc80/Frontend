// Settings component for currency and unit preferences

import React, { useState } from 'react';
import {
  Box,
  Button,
  FieldRoot, 
  FieldLabel,
  Select,
  Switch,
  VStack,
  HStack,
  Text,
  Badge,
  Separator,
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle,
  
} from '@chakra-ui/react';
import { useGlobalization } from '../../contexts/GlobalizationContext.tsx';
import { localeService } from '../../services/localeService.ts';
import { SupportedCurrency, SupportedLocale, UnitSystem } from '../../types/globalization';

interface GlobalizationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalizationSettings: React.FC<GlobalizationSettingsProps> = ({
  isOpen,
  onClose
}) => {
  const { preferences, updatePreferences, refreshExchangeRates, isLoadingRates } = useGlobalization();
  const [tempPreferences, setTempPreferences] = useState(preferences);
  const [isSaving, setIsSaving] = useState(false);

  const currencies = localeService.getAllCurrencies();
  const locales = localeService.getAllLocales();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updatePreferences(tempPreferences);
      
      // Refresh exchange rates if currency changed
      if (tempPreferences.currency !== preferences.currency) {
        await refreshExchangeRates();
      }

      console.log('Settings saved successfully');
      
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempPreferences(preferences);
    onClose();
  };

  const handleAutoDetectChange = (enabled: boolean) => {
    const updated = { ...tempPreferences, autoDetectLocale: enabled };
    
    if (enabled) {
      // Auto-detect locale and update currency/units accordingly
      const detectedLocale = localeService.detectUserLocale();
      updated.locale = detectedLocale;
      updated.currency = localeService.getCurrencyForLocale(detectedLocale);
      updated.unitSystem = localeService.getUnitSystemForLocale(detectedLocale);
    }
    
    setTempPreferences(updated);
  };

  return (
    <>
      <DialogRoot open={isOpen} onOpenChange={(e) => e.open ? {} : handleCancel()}>
        <DialogBackdrop />
        <DialogContent maxW="lg">
          <DialogHeader>
            <DialogTitle>Globalization Settings</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          
          <DialogBody>
          <VStack spacing={6} align="stretch">
            {/* Auto-detect settings */}
            <Box>
              <FieldRoot display="flex" alignItems="center">
                <FieldLabel mb="0" flex="1">
                  Auto-detect locale settings
                </FieldLabel>
                <Switch
                  isChecked={tempPreferences.autoDetectLocale}
                  onChange={(e) => handleAutoDetectChange(e.target.checked)}
                />
              </FieldRoot>
              <Text fontSize="sm" color="gray.600" mt={2}>
                Automatically detect your location and set appropriate currency and units
              </Text>
            </Box>

            <Separator />

            {/* Locale selection */}
            <FieldRoot>
              <FieldLabel>Language & Region</FieldLabel>
              <Select
                value={tempPreferences.locale}
                onChange={(e) => setTempPreferences({
                  ...tempPreferences,
                  locale: e.target.value as SupportedLocale
                })}
                disabled={tempPreferences.autoDetectLocale}
              >
                {locales.map((locale) => (
                  <option key={locale} value={locale}>
                    {localeService.getLocaleDisplayName(locale)}
                  </option>
                ))}
              </Select>
            </FieldRoot>

            {/* Currency selection */}
            <FieldRoot>
              <FieldLabel>
                Currency
                {isLoadingRates && (
                  <Badge colorScheme="blue" ml={2} fontSize="xs">
                    Updating rates...
                  </Badge>
                )}
              </FieldLabel>
              <Select
                value={tempPreferences.currency}
                onChange={(e) => setTempPreferences({
                  ...tempPreferences,
                  currency: e.target.value as SupportedCurrency
                })}
                disabled={tempPreferences.autoDetectLocale}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </option>
                ))}
              </Select>
              <Text fontSize="sm" color="gray.600" mt={1}>
                All prices will be converted to your selected currency
              </Text>
            </FieldRoot>

            {/* Unit system selection */}
            <FieldRoot>
              <FieldLabel>Unit System</FieldLabel>
              <Select
                value={tempPreferences.unitSystem}
                onChange={(e) => setTempPreferences({
                  ...tempPreferences,
                  unitSystem: e.target.value as UnitSystem
                })}
                disabled={tempPreferences.autoDetectLocale}
              >
                <option value="metric">Metric (mm, bar, °C)</option>
                <option value="imperial">Imperial (in, psi, °F)</option>
              </Select>
              <Text fontSize="sm" color="gray.600" mt={1}>
                Measurements will be displayed in your preferred unit system
              </Text>
            </FieldRoot>

            {/* Current settings preview */}
            <Box bg="gray.50" p={4} borderRadius="md">
              <Text fontWeight="semibold" mb={2}>Preview</Text>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm">
                  <strong>Language:</strong> {localeService.getLocaleDisplayName(tempPreferences.locale)}
                </Text>
                <Text fontSize="sm">
                  <strong>Currency:</strong> {localeService.getCurrencyInfo(tempPreferences.currency).name}
                </Text>
                <Text fontSize="sm">
                  <strong>Units:</strong> {tempPreferences.unitSystem === 'metric' ? 'Metric' : 'Imperial'}
                </Text>
                <Text fontSize="sm">
                  <strong>Example price:</strong> {localeService.formatCurrency(1234.56, tempPreferences.currency, tempPreferences.locale)}
                </Text>
              </VStack>
            </Box>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Save Settings
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  </>
  );
};

// Compact settings toggle button
interface GlobalizationToggleProps {
  onOpenSettings: () => void;
}

export const GlobalizationToggle: React.FC<GlobalizationToggleProps> = ({
  onOpenSettings
}) => {
  const { preferences, exchangeRates } = useGlobalization();
  const currencyInfo = localeService.getCurrencyInfo(preferences.currency);
  
  const lastUpdated = exchangeRates ? 
    new Date(exchangeRates.timestamp).toLocaleTimeString() : 
    'Never';

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onOpenSettings}
      title={`Currency: ${currencyInfo.name}, Units: ${preferences.unitSystem}, Last updated: ${lastUpdated}`}
    >
      {currencyInfo.symbol} {preferences.unitSystem === 'metric' ? 'Metric' : 'Imperial'}
    </Button>
  );
};