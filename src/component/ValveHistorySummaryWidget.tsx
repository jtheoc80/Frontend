import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, useToast } from '@chakra-ui/react';

const ValveHistorySummaryWidget: React.FC = () => {
  const toast = useToast();
  const [summary, setSummary] = useState({
    totalValves: 0,
    dueForService: 0,
    underWarranty: 0,
    outOfService: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch('/valve_history_summary');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSummary(data);
        
      } catch (error) {
        console.error('Failed to fetch valve summary:', error);
        toast({
          title: 'Error',
          description: 'Failed to load valve summary data. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [toast]);

  if (loading) {
    return (
      <Box p={5} borderWidth="1px" borderRadius="lg" shadow="md">
        <Text>Loading valve summary...</Text>
      </Box>
    );
  }

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" shadow="md">
      <VStack spacing={4} align="stretch">
        <Text>Total Number of Valves: {summary.totalValves}</Text>
        <Text>Number Due for Service in Next 60 Days: {summary.dueForService}</Text>
        <Text>Number Under Warranty: {summary.underWarranty}</Text>
        <Text>Number Out of Service: {summary.outOfService}</Text>
      </VStack>
    </Box>
  );
};

export default ValveHistorySummaryWidget;