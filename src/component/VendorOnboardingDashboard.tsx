import React, { useState, useEffect } from 'react';
import { Box, Button, Text, VStack, useToast } from '@chakra-ui/react';

interface Vendor {
  id: string;
  name: string;
  status: string;
  msaVersion: string;
  effectiveDate: string;
}

const VendorOnboardingDashboard: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/vendors');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setVendors(data);
        
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
        toast({
          title: 'Error',
          description: 'Failed to load vendor data. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [toast]);

  const handleAccept = async (vendorId: string, msaVersion: string) => {
    try {
      const response = await fetch('/accept_msa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vendorId, msaVersion })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: 'MSA Accepted',
        description: 'You have successfully accepted the MSA.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Update vendor state
      setVendors(prevVendors => 
        prevVendors.map(v => 
          v.id === vendorId ? { ...v, status: 'Accepted' } : v
        )
      );
      
    } catch (error) {
      console.error('Failed to accept MSA:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept MSA. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <VStack spacing={4} align="stretch">
        <Text>Loading vendor data...</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {vendors.map(vendor => (
        <Box key={vendor.id} p={5} shadow="md" borderWidth="1px">
          <Text mt={4}>Vendor: {vendor.name}</Text>
          <Text>Status: {vendor.status}</Text>
          <Text>MSA Version: {vendor.msaVersion}</Text>
          <Text>Effective Date: {vendor.effectiveDate}</Text>
          {vendor.status === 'Pending' && (
            <Button 
              mt={4} 
              colorScheme="green" 
              onClick={() => handleAccept(vendor.id, vendor.msaVersion)}
            >
              Review & Accept MSA
            </Button>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default VendorOnboardingDashboard;