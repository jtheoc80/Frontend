import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Spinner,
  Container
} from "@chakra-ui/react";

const SimpleManufacturerDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const pendingValves = [
    {
      id: 'VLV001',
      serialNumber: 'EMR-2024-001',
      type: 'ball',
      model: 'Series 2000',
      specifications: { diameter: 6, pressure: 1500 },
      manufactureDate: '2024-01-15'
    }
  ];

  const stats = {
    totalValves: 3,
    pendingTokenization: 1,
    inService: 1,
    pendingOrders: 1
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="#1e3a8a">
          Manufacturer Dashboard
        </Heading>

        {/* Dashboard Statistics */}
        <HStack spacing={4} justify="space-around">
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">Total Valves</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#1e3a8a">{stats.totalValves}</Text>
          </Box>
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">Pending Tokenization</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#f59e0b">{stats.pendingTokenization}</Text>
          </Box>
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">In Service</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#10b981">{stats.inService}</Text>
          </Box>
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">Pending Orders</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#3b82f6">{stats.pendingOrders}</Text>
          </Box>
        </HStack>

        {/* Pending Tokenization Queue */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Heading size="md">Pending Valve Tokenization Queue</Heading>
              <Badge colorScheme="orange" fontSize="sm">
                {pendingValves.length} Pending
              </Badge>
            </HStack>

            <VStack spacing={3}>
              {pendingValves.map((valve) => (
                <Box 
                  key={valve.id}
                  p={4} 
                  bg="gray.50" 
                  borderRadius="md" 
                  w="full"
                  border="1px solid #e2e8f0"
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" fontSize="lg">{valve.serialNumber}</Text>
                      <Text fontSize="sm" color="#64748b">
                        Type: <Badge colorScheme="blue" variant="subtle">{valve.type}</Badge> • 
                        Model: {valve.model}
                      </Text>
                      <Text fontSize="sm" color="#64748b">
                        Specs: {valve.specifications.diameter}" • {valve.specifications.pressure} PSI
                      </Text>
                      <Text fontSize="sm" color="#64748b">
                        Manufactured: {new Date(valve.manufactureDate).toLocaleDateString()}
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={2}>
                      <Badge colorScheme="orange">Pending Tokenization</Badge>
                      <Button size="sm" colorScheme="blue">
                        Tokenize
                      </Button>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>

        {/* Quick Actions */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Quick Actions</Heading>
            <HStack spacing={4}>
              <Button colorScheme="blue" variant="outline">
                Add New Valve
              </Button>
              <Button colorScheme="green" variant="outline">
                Bulk Tokenize
              </Button>
              <Button colorScheme="purple" variant="outline">
                Export Report
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default SimpleManufacturerDashboard;