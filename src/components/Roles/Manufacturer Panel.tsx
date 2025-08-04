// src/components/roles/ManufacturerPanel.tsx - Simplified version
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Select,
  Textarea,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertDescription,
  Badge,
  SimpleGrid
} from "@chakra-ui/react";
import { BrowserProvider } from "ethers";
import { ValveDetails, TokenizeValveRequest, ManufacturerAuth } from "../../types/valve.ts";
import valveApiService from "../../services/valveApi.ts";
import { validateValveDetails, formatValidationErrors } from "../../utils/validation.ts";

const ManufacturerPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [manufacturerAuth, setManufacturerAuth] = useState<ManufacturerAuth | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Simplified valve form state
  const [formData, setFormData] = useState({
    serialNumber: "",
    type: "",
    manufacturer: "",
    model: "",
    diameter: "",
    pressure: "",
    temperature: "",
    material: "",
    connectionType: "",
    flowCoefficient: "",
    manufactureDate: "",
    warrantyMonths: "12",
    certifications: ""
  });

  // Authentication check on component mount
  useEffect(() => {
    checkManufacturerAuth();
  }, []);

  const checkManufacturerAuth = async () => {
    setIsAuthenticating(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      // Check if wallet is connected
      if (!window.ethereum) {
        setErrorMessage("Please install MetaMask or another Web3 wallet to continue.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum as any);
      const accounts = await provider.listAccounts();
      
      if (accounts.length === 0) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        return;
      }

      const walletAddress = accounts[0]?.address || accounts[0];
      
      // Mock manufacturer authentication
      const authResult = await valveApiService.validateManufacturer('mfg001', walletAddress);
      
      if (authResult.success && authResult.data) {
        setManufacturerAuth(authResult.data);
        setFormData(prev => ({
          ...prev,
          manufacturer: authResult.data!.name
        }));
        setSuccessMessage(`Welcome, ${authResult.data.name}!`);
      } else {
        setErrorMessage(authResult.message);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrorMessage("Failed to authenticate manufacturer. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear messages when user starts typing
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const validateForm = (): ValveDetails | null => {
    try {
      const valveDetails: ValveDetails = {
        serialNumber: formData.serialNumber,
        type: formData.type as ValveDetails['type'],
        manufacturer: formData.manufacturer,
        model: formData.model,
        specifications: {
          diameter: parseFloat(formData.diameter) || 0,
          pressure: parseFloat(formData.pressure) || 0,
          temperature: parseFloat(formData.temperature) || 0,
          material: formData.material,
          connectionType: formData.connectionType,
          flowCoefficient: formData.flowCoefficient ? parseFloat(formData.flowCoefficient) : undefined
        },
        certifications: formData.certifications ? formData.certifications.split(',').map(s => s.trim()).filter(Boolean) : [],
        manufactureDate: formData.manufactureDate,
        warrantyMonths: parseInt(formData.warrantyMonths) || 12
      };

      const validationResult = validateValveDetails(valveDetails);
      
      if (!validationResult.isValid) {
        setErrorMessage(formatValidationErrors(validationResult.errors));
        return null;
      }
      
      return valveDetails;
    } catch (error) {
      setErrorMessage("Please fill in all required fields with valid values.");
      return null;
    }
  };

  const handleTokenizeValve = async () => {
    if (!manufacturerAuth) {
      setErrorMessage("Please authenticate as a manufacturer first.");
      return;
    }

    const valveDetails = validateForm();
    if (!valveDetails) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const request: TokenizeValveRequest = {
        valveDetails,
        manufacturerId: manufacturerAuth.id
      };

      const response = await valveApiService.tokenizeValve(request);

      if (response.success) {
        setSuccessMessage(`Valve Tokenized Successfully! Token ID: ${response.tokenId}, Valve ID: ${response.valveId}`);
        
        // Reset form
        setFormData({
          serialNumber: "",
          type: "",
          manufacturer: manufacturerAuth.name,
          model: "",
          diameter: "",
          pressure: "",
          temperature: "",
          material: "",
          connectionType: "",
          flowCoefficient: "",
          manufactureDate: "",
          warrantyMonths: "12",
          certifications: ""
        });
      } else {
        setErrorMessage(response.message);
      }
    } catch (error: any) {
      console.error("Tokenization error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      serialNumber: "",
      type: "",
      manufacturer: manufacturerAuth?.name || "",
      model: "",
      diameter: "",
      pressure: "",
      temperature: "",
      material: "",
      connectionType: "",
      flowCoefficient: "",
      manufactureDate: "",
      warrantyMonths: "12",
      certifications: ""
    });
    setErrorMessage("");
    setSuccessMessage("");
  };

  if (isAuthenticating) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="purple.500" />
        <Text mt={4}>Authenticating manufacturer...</Text>
      </Box>
    );
  }

  if (!manufacturerAuth) {
    return (
      <Box p={6}>
        <Alert status="warning">
          <Box>
            <Text fontWeight="bold">Authentication Required</Text>
            <Text>Please connect your wallet and authenticate as a manufacturer to tokenize valves.</Text>
          </Box>
        </Alert>
        <Button mt={4} colorScheme="purple" onClick={checkManufacturerAuth}>
          Authenticate
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="4xl" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Valve Tokenization</Heading>
          <HStack spacing={3}>
            <Badge colorScheme="green" px={3} py={1}>
              Authenticated: {manufacturerAuth.name}
            </Badge>
            <Badge colorScheme="blue" px={3} py={1}>
              ID: {manufacturerAuth.id}
            </Badge>
          </HStack>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert status="success">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert status="error">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Box bg="white" rounded="lg" shadow="sm" border="1px solid" borderColor="gray.200" p={6}>
          <VStack spacing={6} align="stretch">
            {/* Basic Information */}
            <Box>
              <Heading size="md" mb={4}>Basic Information</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text mb={1} fontWeight="semibold">Serial Number *</Text>
                  <Input
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    placeholder="Enter unique serial number"
                  />
                </Box>

                <Box>
                  <Text mb={1} fontWeight="semibold">Valve Type *</Text>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    placeholder="Select valve type"
                  >
                    <option value="gate">Gate Valve</option>
                    <option value="ball">Ball Valve</option>
                    <option value="globe">Globe Valve</option>
                    <option value="butterfly">Butterfly Valve</option>
                    <option value="check">Check Valve</option>
                    <option value="needle">Needle Valve</option>
                    <option value="plug">Plug Valve</option>
                  </Select>
                </Box>

                <Box>
                  <Text mb={1} fontWeight="semibold">Manufacturer *</Text>
                  <Input
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    placeholder="Manufacturer name"
                    isReadOnly
                    bg="gray.50"
                  />
                </Box>

                <Box>
                  <Text mb={1} fontWeight="semibold">Model *</Text>
                  <Input
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="Enter model number"
                  />
                </Box>
              </SimpleGrid>
            </Box>

            <Box height="1px" bg="gray.200" my={4} />

            {/* Technical Specifications */}
            <Box>
              <Heading size="md" mb={4}>Technical Specifications</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                <Box>
                  <Text mb={1} fontWeight="semibold">Diameter (inches) *</Text>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1000"
                    value={formData.diameter}
                    onChange={(e) => handleInputChange('diameter', e.target.value)}
                    placeholder="0.0"
                  />
                </Box>

                <Box>
                  <Text mb={1} fontWeight="semibold">Pressure Rating (PSI) *</Text>
                  <Input
                    type="number"
                    min="0"
                    max="10000"
                    value={formData.pressure}
                    onChange={(e) => handleInputChange('pressure', e.target.value)}
                    placeholder="0"
                  />
                </Box>

                <Box>
                  <Text mb={1} fontWeight="semibold">Temperature Rating (°C) *</Text>
                  <Input
                    type="number"
                    min="-273"
                    max="2000"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    placeholder="0"
                  />
                </Box>

                <Box>
                  <Text mb={1} fontWeight="semibold">Material *</Text>
                  <Input
                    value={formData.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    placeholder="e.g., Stainless Steel 316"
                  />
                </Box>

                <Box>
                  <Text mb={1} fontWeight="semibold">Connection Type *</Text>
                  <Input
                    value={formData.connectionType}
                    onChange={(e) => handleInputChange('connectionType', e.target.value)}
                    placeholder="e.g., Flanged, Threaded"
                  />
                </Box>

                <Box>
                  <Text mb={1} fontWeight="semibold">Flow Coefficient (Cv)</Text>
                  <Input
                    type="number"
                    min="0"
                    value={formData.flowCoefficient}
                    onChange={(e) => handleInputChange('flowCoefficient', e.target.value)}
                    placeholder="Optional"
                  />
                </Box>
              </SimpleGrid>
            </Box>

            <Box height="1px" bg="gray.200" my={4} />

            {/* Additional Information */}
            <Box>
              <Heading size="md" mb={4}>Additional Information</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text mb={1} fontWeight="semibold">Manufacture Date *</Text>
                  <Input
                    type="date"
                    value={formData.manufactureDate}
                    onChange={(e) => handleInputChange('manufactureDate', e.target.value)}
                  />
                </Box>

                <Box>
                  <Text mb={1} fontWeight="semibold">Warranty (months) *</Text>
                  <Input
                    type="number"
                    min="0"
                    max="240"
                    value={formData.warrantyMonths}
                    onChange={(e) => handleInputChange('warrantyMonths', e.target.value)}
                    placeholder="12"
                  />
                </Box>
              </SimpleGrid>

              <Box mt={4}>
                <Text mb={1} fontWeight="semibold">Certifications (comma-separated)</Text>
                <Textarea
                  value={formData.certifications}
                  onChange={(e) => handleInputChange('certifications', e.target.value)}
                  placeholder="e.g., API 6D, ISO 14313, ASME B16.34"
                  rows={3}
                />
              </Box>
            </Box>

            {/* Submit Buttons */}
            <HStack spacing={4} justify="flex-end">
              <Button
                variant="outline"
                onClick={resetForm}
              >
                Reset Form
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleTokenizeValve}
                isLoading={isLoading}
                loadingText="Tokenizing..."
                size="lg"
              >
                Tokenize Valve
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ManufacturerPanel;