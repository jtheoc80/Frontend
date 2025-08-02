import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack,
  Button,
  Input,
  Select,
  Spinner,
  useToast,
  Badge,
  SimpleGrid
} from '@chakra-ui/react';
import { 
  Table, 
  TableContainer,
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td 
} from '@chakra-ui/react';

// Simulated valve history data
const generateValveHistory = () => {
  const statuses = ['Active', 'Maintenance', 'Retired', 'Under Repair'];
  const locations = ['Plant A', 'Plant B', 'Plant C', 'Storage'];
  const manufacturers = ['Emerson', 'Kitz', 'Cameron', 'Flowserve'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `VLV-${String(i + 1).padStart(3, '0')}`,
    serialNumber: `SN${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
    model: `Model-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    installDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    lastService: new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    pressure: Math.floor(Math.random() * 1000) + 100,
    temperature: Math.floor(Math.random() * 200) + 50,
  }));
};

const AdvancedValveHistoryPanel: React.FC = () => {
  const [valves, setValves] = useState<any[]>([]);
  const [filteredValves, setFilteredValves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    status: '',
    manufacturer: '',
    search: ''
  });
  const toast = useToast();

  // Simulate async data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = generateValveHistory();
      setValves(data);
      setFilteredValves(data);
      setLoading(false);
      
      toast({
        title: "Valve History Loaded",
        description: `Loaded ${data.length} valve records`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    };

    loadData();
  }, [toast]);

  // Apply filters
  useEffect(() => {
    let filtered = valves;

    if (filters.location) {
      filtered = filtered.filter(valve => valve.location === filters.location);
    }
    if (filters.status) {
      filtered = filtered.filter(valve => valve.status === filters.status);
    }
    if (filters.manufacturer) {
      filtered = filtered.filter(valve => valve.manufacturer === filters.manufacturer);
    }
    if (filters.search) {
      filtered = filtered.filter(valve => 
        valve.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        valve.serialNumber.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredValves(filtered);
  }, [valves, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Maintenance': return 'orange';
      case 'Under Repair': return 'red';
      case 'Retired': return 'gray';
      default: return 'blue';
    }
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text>Loading comprehensive valve history...</Text>
          <Text fontSize="sm" color="gray.500">This may take a moment</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Advanced Valve History & Analytics</Heading>
          <Text color="gray.600">
            Comprehensive tracking of all valve operations, maintenance, and performance metrics
          </Text>
        </Box>

        {/* Statistics Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Box bg="green.50" p={4} rounded="lg" border="1px" borderColor="green.200">
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              {filteredValves.filter(v => v.status === 'Active').length}
            </Text>
            <Text fontSize="sm" color="green.600">Active Valves</Text>
          </Box>
          <Box bg="orange.50" p={4} rounded="lg" border="1px" borderColor="orange.200">
            <Text fontSize="2xl" fontWeight="bold" color="orange.600">
              {filteredValves.filter(v => v.status === 'Maintenance').length}
            </Text>
            <Text fontSize="sm" color="orange.600">In Maintenance</Text>
          </Box>
          <Box bg="red.50" p={4} rounded="lg" border="1px" borderColor="red.200">
            <Text fontSize="2xl" fontWeight="bold" color="red.600">
              {filteredValves.filter(v => v.status === 'Under Repair').length}
            </Text>
            <Text fontSize="sm" color="red.600">Under Repair</Text>
          </Box>
          <Box bg="blue.50" p={4} rounded="lg" border="1px" borderColor="blue.200">
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {filteredValves.length}
            </Text>
            <Text fontSize="sm" color="blue.600">Total Shown</Text>
          </Box>
        </SimpleGrid>

        {/* Filters */}
        <Box bg="gray.50" p={4} rounded="lg">
          <Heading size="md" mb={3}>Filters</Heading>
          <HStack spacing={4} wrap="wrap">
            <Input
              placeholder="Search by ID or Serial..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              maxW="200px"
            />
            <Select
              placeholder="All Locations"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              maxW="150px"
            >
              <option value="Plant A">Plant A</option>
              <option value="Plant B">Plant B</option>
              <option value="Plant C">Plant C</option>
              <option value="Storage">Storage</option>
            </Select>
            <Select
              placeholder="All Statuses"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              maxW="150px"
            >
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Under Repair">Under Repair</option>
              <option value="Retired">Retired</option>
            </Select>
            <Select
              placeholder="All Manufacturers"
              value={filters.manufacturer}
              onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
              maxW="150px"
            >
              <option value="Emerson">Emerson</option>
              <option value="Kitz">Kitz</option>
              <option value="Cameron">Cameron</option>
              <option value="Flowserve">Flowserve</option>
            </Select>
            <Button 
              onClick={() => setFilters({ location: '', status: '', manufacturer: '', search: '' })}
              variant="outline"
            >
              Clear Filters
            </Button>
          </HStack>
        </Box>

        {/* Data Table */}
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Valve ID</Th>
                <Th>Serial Number</Th>
                <Th>Manufacturer</Th>
                <Th>Model</Th>
                <Th>Location</Th>
                <Th>Status</Th>
                <Th>Install Date</Th>
                <Th>Last Service</Th>
                <Th>Pressure (PSI)</Th>
                <Th>Temperature (°F)</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredValves.map((valve) => (
                <Tr key={valve.id}>
                  <Td fontWeight="medium">{valve.id}</Td>
                  <Td fontFamily="mono" fontSize="sm">{valve.serialNumber}</Td>
                  <Td>{valve.manufacturer}</Td>
                  <Td>{valve.model}</Td>
                  <Td>{valve.location}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(valve.status)}>
                      {valve.status}
                    </Badge>
                  </Td>
                  <Td>{valve.installDate}</Td>
                  <Td>{valve.lastService}</Td>
                  <Td isNumeric>{valve.pressure}</Td>
                  <Td isNumeric>{valve.temperature}</Td>
                  <Td>
                    <HStack spacing={1}>
                      <Button size="xs" variant="outline">View</Button>
                      <Button size="xs" colorScheme="blue">Edit</Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {filteredValves.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">No valves match the current filters</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AdvancedValveHistoryPanel;