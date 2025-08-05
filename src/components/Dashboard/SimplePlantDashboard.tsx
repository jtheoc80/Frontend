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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from "@chakra-ui/react";

const SimplePlantDashboard = () => {
  // Mock data
  const dashboardData = {
    pendingInstallation: [
      {
        id: 'VLV001',
        serialNumber: 'EMR-2024-001',
        type: 'ball',
        model: 'Series 2000',
        location: 'Plant Unit A-1'
      }
    ],
    scheduledMaintenance: [
      {
        id: 'VLV002',
        serialNumber: 'EMR-2024-002',
        location: 'Plant Unit B-1',
        lastMaintenanceDate: '2024-03-01',
        nextMaintenanceDate: '2024-09-01'
      }
    ],
    inRepair: [
      {
        id: 'VLV003',
        serialNumber: 'KTZ-2024-001',
        location: 'Plant Unit C-1'
      }
    ],
    inServiceCount: 5
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="#1e3a8a">
          Plant Operations Dashboard
        </Heading>

        {/* Key Metrics */}
        <HStack spacing={4} justify="space-around">
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">Valves In Service</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#10b981">{dashboardData.inServiceCount}</Text>
            <Text fontSize="xs" color="#64748b">Currently operational</Text>
          </Box>
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">Pending Installation</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#3b82f6">{dashboardData.pendingInstallation.length}</Text>
            <Text fontSize="xs" color="#64748b">Ready for setup</Text>
          </Box>
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">Scheduled Maintenance</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#f59e0b">{dashboardData.scheduledMaintenance.length}</Text>
            <Text fontSize="xs" color="#64748b">Upcoming service</Text>
          </Box>
          <Box bg="white" p={4} borderRadius="md" shadow="sm" border="1px solid #e2e8f0" textAlign="center">
            <Text fontSize="sm" color="#64748b">In Repair</Text>
            <Text fontSize="2xl" fontWeight="bold" color="#ef4444">{dashboardData.inRepair.length}</Text>
            <Text fontSize="xs" color="#64748b">Out of service</Text>
          </Box>
        </HStack>

        {/* Detailed Views */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <Tabs>
            <TabList>
              <Tab>Pending Installation ({dashboardData.pendingInstallation.length})</Tab>
              <Tab>Scheduled Maintenance ({dashboardData.scheduledMaintenance.length})</Tab>
              <Tab>In Repair ({dashboardData.inRepair.length})</Tab>
            </TabList>

            <TabPanels mt={4}>
              {/* Pending Installation Tab */}
              <TabPanel px={0}>
                <VStack spacing={3}>
                  {dashboardData.pendingInstallation.map((valve) => (
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
                            Planned Location: {valve.location}
                          </Text>
                        </VStack>
                        <Button size="sm" colorScheme="green">
                          Install
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>

              {/* Scheduled Maintenance Tab */}
              <TabPanel px={0}>
                <VStack spacing={3}>
                  {dashboardData.scheduledMaintenance.map((valve) => (
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
                            Location: {valve.location}
                          </Text>
                          <Text fontSize="sm" color="#64748b">
                            Last Maintenance: {valve.lastMaintenanceDate
                              ? new Date(valve.lastMaintenanceDate).toLocaleDateString()
                              : 'Never'
                            }
                          </Text>
                          <Text fontSize="sm" color="#64748b">
                            Next Maintenance: {valve.nextMaintenanceDate
                              ? new Date(valve.nextMaintenanceDate).toLocaleDateString()
                              : 'TBD'
                            }
                          </Text>
                        </VStack>
                        <Button size="sm" colorScheme="orange">
                          Schedule
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>

              {/* In Repair Tab */}
              <TabPanel px={0}>
                <VStack spacing={3}>
                  {dashboardData.inRepair.map((valve) => (
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
                            Location: {valve.location}
                          </Text>
                          <Badge colorScheme="red">In Repair</Badge>
                        </VStack>
                        <Button size="sm" colorScheme="blue" variant="outline">
                          View Details
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Quick Actions */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Plant Operations</Heading>
            <HStack spacing={4}>
              <Button colorScheme="green" variant="outline">
                Schedule Installation
              </Button>
              <Button colorScheme="orange" variant="outline">
                Plan Maintenance
              </Button>
              <Button colorScheme="red" variant="outline">
                Report Issue
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

export default SimplePlantDashboard;