import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Container,
  Progress
} from "@chakra-ui/react";

const SimpleRepairDashboard = () => {
  // Mock data
  const valvesInRepair = [
    {
      id: 'VLV003',
      serialNumber: 'KTZ-2024-001',
      type: 'butterfly',
      location: 'Plant Unit B-2'
    }
  ];

  const repairRecords = [
    {
      id: 'REP001',
      valveId: 'VLV003',
      contractorName: 'Industrial Repair Services',
      startDate: '2024-04-16',
      expectedCompletionDate: '2024-04-20',
      description: 'Actuator replacement and seal inspection',
      status: 'in_progress',
      cost: 1500
    }
  ];

  const getDaysInRepair = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    return Math.ceil((today.getTime() - start.getTime()) / (1000 * 3600 * 24));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'blue';
      case 'in_progress': return 'orange';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="#1e3a8a">
          Repair Services Dashboard
        </Heading>

        {/* Repair Statistics */}
        <HStack spacing={4} justify="space-around">
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">Valves in Repair</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#ef4444">{valvesInRepair.length}</Text>
            <Text fontSize="xs" color="#64748b">Currently out of service</Text>
          </Box>
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">Active Repairs</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#f59e0b">
              {repairRecords.filter(r => r.status === 'in_progress').length}
            </Text>
            <Text fontSize="xs" color="#64748b">In progress</Text>
          </Box>
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">Pending Requests</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#3b82f6">
              {repairRecords.filter(r => r.status === 'requested').length}
            </Text>
            <Text fontSize="xs" color="#64748b">Awaiting assignment</Text>
          </Box>
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">Completed This Month</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#10b981">
              {repairRecords.filter(r => r.status === 'completed').length}
            </Text>
            <Text fontSize="xs" color="#64748b">Successfully repaired</Text>
          </Box>
        </HStack>

        {/* Current Repairs Table */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Heading size="md">Valves Currently in Repair Process</Heading>
              <Badge colorScheme="red" fontSize="sm">
                {valvesInRepair.length} In Process
              </Badge>
            </HStack>

            <VStack spacing={3}>
              {valvesInRepair.map((valve) => {
                const repairRecord = repairRecords.find(r => r.valveId === valve.id);
                return (
                  <Box 
                    key={valve.id}
                    p={4} 
                    bg="gray.50" 
                    borderRadius="md" 
                    w="full"
                    border="1px solid #e2e8f0"
                  >
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="semibold" fontSize="lg">{valve.serialNumber}</Text>
                          <Text fontSize="sm" color="#64748b">
                            Type: <Badge colorScheme="blue" variant="subtle">{valve.type}</Badge> • 
                            Location: {valve.location}
                          </Text>
                          <Text fontSize="sm" color="#64748b">
                            Contractor: {repairRecord?.contractorName || 'Unassigned'}
                          </Text>
                          <Text fontSize="sm" color="#64748b">
                            Days in Repair: {repairRecord ? getDaysInRepair(repairRecord.startDate) : 0} days
                          </Text>
                        </VStack>
                        <VStack align="end" spacing={2}>
                          <Badge colorScheme={getStatusColor(repairRecord?.status || 'unknown')}>
                            {repairRecord?.status || 'Unknown'}
                          </Badge>
                          <HStack spacing={2}>
                            <Button size="sm" colorScheme="blue">
                              Update
                            </Button>
                            <Button size="sm" variant="outline" colorScheme="gray">
                              Details
                            </Button>
                          </HStack>
                        </VStack>
                      </HStack>
                      <Box>
                        <Text fontSize="xs" color="#64748b" mb={1}>Progress</Text>
                        <Progress
                          value={repairRecord?.status === 'in_progress' ? 50 : 0}
                          size="sm"
                          colorScheme="orange"
                        />
                        <Text fontSize="xs" color="#64748b" mt={1}>
                          {repairRecord?.status === 'in_progress' ? '50%' : '0%'}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                );
              })}
            </VStack>
          </VStack>
        </Box>

        {/* Recent Repair Activity */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Recent Repair Activity</Heading>
            <VStack spacing={3}>
              {repairRecords.map((record) => (
                <Box 
                  key={record.id}
                  p={3} 
                  bg="gray.50" 
                  borderRadius="md" 
                  w="full"
                  border="1px solid #e2e8f0"
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold">{record.valveId}</Text>
                      <Text fontSize="sm" color="#64748b">
                        Contractor: {record.contractorName}
                      </Text>
                      <Text fontSize="sm" color="#64748b">
                        Started: {new Date(record.startDate).toLocaleDateString()} • 
                        Expected: {record.expectedCompletionDate
                          ? new Date(record.expectedCompletionDate).toLocaleDateString()
                          : 'TBD'
                        }
                      </Text>
                      <Text fontSize="sm" color="#64748b">
                        Cost: {record.cost ? `$${record.cost.toLocaleString()}` : 'TBD'}
                      </Text>
                    </VStack>
                    <Badge colorScheme={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>

        {/* Quick Actions */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Repair Management</Heading>
            <HStack spacing={4}>
              <Button colorScheme="red" variant="outline">
                Create Repair Request
              </Button>
              <Button colorScheme="orange" variant="outline">
                Assign Contractor
              </Button>
              <Button colorScheme="green" variant="outline">
                Mark as Completed
              </Button>
              <Button colorScheme="purple" variant="outline">
                Generate Report
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default SimpleRepairDashboard;