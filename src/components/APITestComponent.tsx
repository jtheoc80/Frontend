import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Button } from '@chakra-ui/react';

interface ValveData {
  valves: Array<{
    valve_id: string;
    contract_address: string;
    status: string;
    location: string;
    last_maintenance: string;
    on_chain: boolean;
  }>;
  total: number;
}

const APITestComponent = () => {
  const [expressApiStatus, setExpressApiStatus] = useState('Testing...');
  const [fastApiStatus, setFastApiStatus] = useState('Testing...');
  const [valveData, setValveData] = useState<ValveData | null>(null);
  const [vendorData, setVendorData] = useState<any[] | null>(null);

  const EXPRESS_API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
  const BLOCKCHAIN_API_URL = process.env.REACT_APP_BLOCKCHAIN_API_URL || 'http://localhost:8001';

  const testAPIs = async () => {
    // Test Express API
    try {
      const expressResponse = await fetch(`${EXPRESS_API_URL}/health`);
      if (expressResponse.ok) {
        setExpressApiStatus('✅ Connected');
        
        // Get vendor data
        const vendorResponse = await fetch(`${EXPRESS_API_URL}/api/vendors`);
        if (vendorResponse.ok) {
          const vendors = await vendorResponse.json();
          setVendorData(vendors);
        }
      } else {
        setExpressApiStatus('❌ Failed');
      }
    } catch (error) {
      setExpressApiStatus('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

    // Test FastAPI
    try {
      const fastApiResponse = await fetch(`${BLOCKCHAIN_API_URL}/health`);
      if (fastApiResponse.ok) {
        setFastApiStatus('✅ Connected');
        
        // Get valve data
        const valveResponse = await fetch(`${BLOCKCHAIN_API_URL}/blockchain/valves`);
        if (valveResponse.ok) {
          const valves = await valveResponse.json();
          setValveData(valves);
        }
      } else {
        setFastApiStatus('❌ Failed');
      }
    } catch (error) {
      setFastApiStatus('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    testAPIs();
  }, []);

  return (
    <VStack gap={4} align="stretch">
      <Box p={4} borderWidth={1} borderRadius="md" bg="blue.50">
        <Text fontWeight="bold" color="blue.800">API Connectivity Test</Text>
      </Box>
      
      <Box>
        <Text fontWeight="bold">Express API Status:</Text>
        <Text>{expressApiStatus}</Text>
        <Text fontSize="sm" color="gray.500">{EXPRESS_API_URL}</Text>
      </Box>

      <Box>
        <Text fontWeight="bold">FastAPI Status:</Text>
        <Text>{fastApiStatus}</Text>
        <Text fontSize="sm" color="gray.500">{BLOCKCHAIN_API_URL}</Text>
      </Box>

      <Button onClick={testAPIs} colorScheme="blue">
        Refresh API Status
      </Button>

      {vendorData && vendorData.length > 0 && (
        <Box>
          <Text fontWeight="bold">Sample Vendor Data (Express API):</Text>
          <Text fontSize="sm" fontFamily="mono" bg="gray.100" p={2} borderRadius="md">
            {JSON.stringify(vendorData[0], null, 2)}
          </Text>
        </Box>
      )}

      {valveData && valveData.valves && valveData.valves.length > 0 && (
        <Box>
          <Text fontWeight="bold">Sample Valve Data (FastAPI):</Text>
          <Text fontSize="sm" fontFamily="mono" bg="gray.100" p={2} borderRadius="md">
            {JSON.stringify(valveData.valves[0], null, 2)}
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default APITestComponent;