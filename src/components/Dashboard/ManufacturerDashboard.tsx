import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Container
} from "@chakra-ui/react";
import { ValveAsset, DashboardStats } from "../../types/valve";
import valveApiService from "../../services/valveApi";

const ManufacturerDashboard = () => {
  const [pendingValves, setPendingValves] = useState<ValveAsset[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Load pending valves for tokenization
      const pendingResponse = await valveApiService.getValvesByStatus('pending_tokenization');
      if (pendingResponse.success && pendingResponse.data) {
        setPendingValves(pendingResponse.data);
      }

      // Load dashboard statistics
      const statsResponse = await valveApiService.getDashboardStats();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenizeValve = async (valve: ValveAsset) => {
    // This would typically open a tokenization modal or redirect to tokenization form
    console.log("Tokenize valve:", valve.serialNumber);
  };

  if (isLoading) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading manufacturer dashboard...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="#1e3a8a">
          Manufacturer Dashboard
        </Heading>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Dashboard Statistics */}
        {stats && (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
              <Text fontSize="sm" color="#64748b">Total Valves</Text>
              <Text fontSize="2xl" fontWeight="bold" color="#1e3a8a">{stats.totalValves}</Text>
            </Box>
            <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
              <Text fontSize="sm" color="#64748b">Pending Tokenization</Text>
              <Text fontSize="2xl" fontWeight="bold" color="#f59e0b">{stats.pendingTokenization}</Text>
            </Box>
            <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
              <Text fontSize="sm" color="#64748b">In Service</Text>
              <Text fontSize="2xl" fontWeight="bold" color="#10b981">{stats.inService}</Text>
            </Box>
            <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
              <Text fontSize="sm" color="#64748b">Pending Orders</Text>
              <Text fontSize="2xl" fontWeight="bold" color="#3b82f6">{stats.pendingOrders}</Text>
            </Box>
          </SimpleGrid>
        )}

        {/* Pending Tokenization Queue */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Heading size="md">Pending Valve Tokenization Queue</Heading>
              <Badge colorScheme="orange" fontSize="sm">
                {pendingValves.length} Pending
              </Badge>
            </HStack>

            {pendingValves.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="#64748b" fontSize="lg">
                  No valves pending tokenization
                </Text>
                <Text color="#64748b" fontSize="sm" mt={2}>
                  All manufactured valves have been tokenized and are ready for distribution
                </Text>
              </Box>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Serial Number</Th>
                      <Th>Type</Th>
                      <Th>Model</Th>
                      <Th>Specifications</Th>
                      <Th>Manufacture Date</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pendingValves.map((valve) => (
                      <Tr key={valve.id}>
                        <Td fontWeight="semibold">{valve.serialNumber}</Td>
                        <Td>
                          <Badge colorScheme="blue" variant="subtle">
                            {valve.type}
                          </Badge>
                        </Td>
                        <Td>{valve.model}</Td>
                        <Td>
                          <Text fontSize="sm">
                            {valve.specifications.diameter}" • {valve.specifications.pressure} PSI
                          </Text>
                          <Text fontSize="xs" color="#64748b">
                            {valve.specifications.material}
                          </Text>
                        </Td>
                        <Td>{new Date(valve.manufactureDate).toLocaleDateString()}</Td>
                        <Td>
                          <Badge colorScheme="orange">
                            Pending Tokenization
                          </Badge>
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleTokenizeValve(valve)}
                          >
                            Tokenize
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Additional Actions */}
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

export default ManufacturerDashboard;