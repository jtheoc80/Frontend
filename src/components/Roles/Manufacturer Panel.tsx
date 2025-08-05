// src/components/roles/ManufacturerPanel.tsx - Simplified version
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Badge,
  SimpleGrid
} from "@chakra-ui/react";
import { ValveDetails, TokenizeValveRequest, ManufacturerAuth } from "../../types/valve.ts";
import valveApiService from "../../services/valveApi.ts";
import { validateValveDetails, formatValidationErrors } from "../../utils/validation.ts";

const ManufacturerPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [manufacturerAuth, setManufacturerAuth] = useState<ManufacturerAuth | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Token ticker state
  const [tokenCount, setTokenCount] = useState<number>(1247);
  const [tickerLoading, setTickerLoading] = useState(false);
  const [lastTickerUpdate, setLastTickerUpdate] = useState<Date>(new Date());

  // Transfer state
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSerial, setTransferSerial] = useState("");
  const [transferToAddress, setTransferToAddress] = useState("");
  const [transferSuccessMessage, setTransferSuccessMessage] = useState<string>("");
  const [transferErrorMessage, setTransferErrorMessage] = useState<string>("");

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
    // Set up token count polling
    const interval = setInterval(updateTokenCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Update token count (simulate real-time data)
  const updateTokenCount = () => {
    setTickerLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      // Simulate some variation in token count
      const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
      setTokenCount(prev => Math.max(0, prev + variation));
      setLastTickerUpdate(new Date());
      setTickerLoading(false);
    }, 500);
  };

  const refreshTokenCount = () => {
    updateTokenCount();
  };

  const checkManufacturerAuth = async () => {
    setIsAuthenticating(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      // For demo purposes, simulate successful authentication without requiring actual wallet
      setTimeout(() => {
        const mockAuth: ManufacturerAuth = {
          id: 'mfg001',
          name: 'Emerson Process Management',
          isAuthenticated: true,
          walletAddress: '0x742d35Cc6436C0532925a3b8D0000a5492d95a8b',
          permissions: ['tokenize_valves', 'transfer_valves']
        };
        
        setManufacturerAuth(mockAuth);
        setFormData(prev => ({
          ...prev,
          manufacturer: mockAuth.name
        }));
        setSuccessMessage(`Welcome, ${mockAuth.name}!`);
        setIsAuthenticating(false);
      }, 1000);
      
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrorMessage("Failed to authenticate manufacturer. Please try again.");
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
        
        // Increment token count when valve is tokenized
        setTokenCount(prev => prev + 1);
        setLastTickerUpdate(new Date());
        
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

  const handleTransferValve = async () => {
    if (!manufacturerAuth) {
      setTransferErrorMessage("Please authenticate as a manufacturer first.");
      setTransferSuccessMessage("");
      return;
    }

    if (!transferSerial.trim()) {
      setTransferErrorMessage("Please enter a valve serial number.");
      setTransferSuccessMessage("");
      return;
    }

    if (!transferToAddress.trim()) {
      setTransferErrorMessage("Please enter a destination address.");
      setTransferSuccessMessage("");
      return;
    }

    setIsTransferring(true);
    setTransferErrorMessage("");
    setTransferSuccessMessage("");

    try {
      // For demo purposes, simulate the blockchain transfer
      setTimeout(() => {
        setTransferSuccessMessage(`✅ Valve ${transferSerial} has been successfully transferred to ${transferToAddress}. Transaction hash: 0x${Math.random().toString(16).substr(2, 8)}...`);
        setTransferErrorMessage("");

        // Reset transfer form
        setTransferSerial("");
        setTransferToAddress("");
        setIsTransferring(false);
      }, 2000);
      
    } catch (error: any) {
      console.error("Transfer error:", error);
      setTransferErrorMessage(error.message || "An unexpected error occurred during the transfer.");
      setTransferSuccessMessage("");
      setIsTransferring(false);
    }
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
        <Box 
          p={4} 
          border="1px solid" 
          borderColor="orange.200" 
          bg="orange.50" 
          borderRadius="md"
          mb={4}
        >
          <Text fontWeight="bold" color="orange.800">Authentication Required</Text>
          <Text color="orange.700">Please connect your wallet and authenticate as a manufacturer to tokenize valves.</Text>
        </Box>
        <Button mt={4} colorScheme="purple" onClick={checkManufacturerAuth}>
          Authenticate
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="4xl" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header with Token Ticker */}
        <Box>
          <HStack spacing={6} align="start" justify="space-between" wrap="wrap">
            <Box flex="1" minW="300px">
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
            
            {/* Token Count Ticker */}
            <Box
              bg="white"
              rounded="lg"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
              p={4}
              minW="250px"
              flexShrink={0}
            >
              <VStack spacing={3} align="stretch">
                {/* Header */}
                <HStack justify="space-between" align="center">
                  <HStack spacing={2}>
                    <Text fontSize="lg">🔗</Text>
                    <Text fontWeight="bold" color="gray.700" fontSize="xl">
                      Lifetime Tokens
                    </Text>
                  </HStack>
                  
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={refreshTokenCount}
                    isLoading={tickerLoading}
                    _hover={{ bg: 'gray.100' }}
                  >
                    ↻
                  </Button>
                </HStack>

                {/* Token Count Display */}
                <Box textAlign="center">
                  <Text
                    fontWeight="bold"
                    color="purple.600"
                    fontSize="3xl"
                    lineHeight="1"
                  >
                    {tokenCount.toLocaleString()}
                  </Text>
                  <Text color="gray.600" fontSize="md">
                    Active Tokens
                  </Text>
                </Box>

                {/* Footer Info */}
                <VStack spacing={2} fontSize="sm" color="gray.500">
                  <Text>
                    Updated {Math.floor((new Date().getTime() - lastTickerUpdate.getTime()) / 1000)}s ago
                  </Text>
                  
                  <HStack spacing={2} justify="center">
                    <Badge colorScheme="orange" size="sm">
                      Demo Mode
                    </Badge>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          </HStack>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Box 
            p={4} 
            border="1px solid" 
            borderColor="green.200" 
            bg="green.50" 
            borderRadius="md"
          >
            <Text color="green.800">{successMessage}</Text>
          </Box>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Box 
            p={4} 
            border="1px solid" 
            borderColor="red.200" 
            bg="red.50" 
            borderRadius="md"
          >
            <Text color="red.800">{errorMessage}</Text>
          </Box>
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
                  <Box as="select"
                    value={formData.type}
                    onChange={(e: any) => handleInputChange('type', e.target.value)}
                    placeholder="Select valve type"
                    w="full"
                    p={2}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    bg="white"
                  >
                    <option value="">Select valve type</option>
                    <option value="gate">Gate Valve</option>
                    <option value="ball">Ball Valve</option>
                    <option value="globe">Globe Valve</option>
                    <option value="butterfly">Butterfly Valve</option>
                    <option value="check">Check Valve</option>
                    <option value="needle">Needle Valve</option>
                    <option value="plug">Plug Valve</option>
                  </Box>
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
                <Box as="textarea"
                  value={formData.certifications}
                  onChange={(e: any) => handleInputChange('certifications', e.target.value)}
                  placeholder="e.g., API 6D, ISO 14313, ASME B16.34"
                  rows={3}
                  w="full"
                  p={2}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  bg="white"
                  resize="vertical"
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

        {/* Valve Transfer Section */}
        <Box bg="white" rounded="lg" shadow="sm" border="1px solid" borderColor="gray.200" p={6}>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" mb={2}>Transfer Valve</Heading>
              <Text color="gray.600" fontSize="sm">
                Transfer ownership of a valve to another entity using the blockchain.
              </Text>
            </Box>

            {/* Transfer Success Message */}
            {transferSuccessMessage && (
              <Box 
                p={4} 
                border="1px solid" 
                borderColor="green.200" 
                bg="green.50" 
                borderRadius="md"
              >
                <Text color="green.800">{transferSuccessMessage}</Text>
              </Box>
            )}

            {/* Transfer Error Message */}
            {transferErrorMessage && (
              <Box 
                p={4} 
                border="1px solid" 
                borderColor="red.200" 
                bg="red.50" 
                borderRadius="md"
              >
                <Text color="red.800">{transferErrorMessage}</Text>
              </Box>
            )}

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text mb={1} fontWeight="semibold">Valve Serial Number *</Text>
                <Input
                  value={transferSerial}
                  onChange={(e) => {
                    setTransferSerial(e.target.value);
                    // Clear messages when user starts typing
                    if (transferErrorMessage) setTransferErrorMessage("");
                    if (transferSuccessMessage) setTransferSuccessMessage("");
                  }}
                  placeholder="Enter valve serial number"
                />
              </Box>

              <Box>
                <Text mb={1} fontWeight="semibold">Destination Address *</Text>
                <Input
                  value={transferToAddress}
                  onChange={(e) => {
                    setTransferToAddress(e.target.value);
                    // Clear messages when user starts typing
                    if (transferErrorMessage) setTransferErrorMessage("");
                    if (transferSuccessMessage) setTransferSuccessMessage("");
                  }}
                  placeholder="0x..."
                />
              </Box>
            </SimpleGrid>

            <HStack spacing={4} justify="flex-end">
              <Button
                variant="outline"
                onClick={() => {
                  setTransferSerial("");
                  setTransferToAddress("");
                  setTransferErrorMessage("");
                  setTransferSuccessMessage("");
                }}
              >
                Clear Fields
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleTransferValve}
                isLoading={isTransferring}
                loadingText="Transferring..."
                size="lg"
              >
                Transfer Valve
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ManufacturerPanel;