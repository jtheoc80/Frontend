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
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from "@chakra-ui/react";
import { ValveAsset } from "../../types/valve";
import valveApiService from "../../services/valveApi";

interface PlantDashboardData {
  pendingInstallation: ValveAsset[];
  scheduledMaintenance: ValveAsset[];
  inRepair: ValveAsset[];
  inServiceCount: number;
}

const PlantDashboard = () => {
  const [dashboardData, setDashboardData] = useState<PlantDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadPlantData();
  }, []);

  const loadPlantData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await valveApiService.getPlantDashboardData();
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      setError("Failed to load plant dashboard data");
      console.error("Plant dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstallValve = (valve: ValveAsset) => {
    console.log("Install valve:", valve.serialNumber);
    // This would open an installation modal or form
  };

  const handleScheduleMaintenance = (valve: ValveAsset) => {
    console.log("Schedule maintenance for valve:", valve.serialNumber);
    // This would open a maintenance scheduling modal
  };

  const handleViewRepair = (valve: ValveAsset) => {
    console.log("View repair details for valve:", valve.serialNumber);
    // This would open repair details modal
  };

  const getMaintenanceStatus = (valve: ValveAsset) => {
    if (!valve.nextMaintenanceDate) return 'No Schedule';
    
    const nextDate = new Date(valve.nextMaintenanceDate);
    const today = new Date();
    const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil <= 7) return 'Due Soon';
    if (daysUntil <= 30) return 'Scheduled';
    return 'Future';
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'Overdue': return 'red';
      case 'Due Soon': return 'orange';
      case 'Scheduled': return 'blue';
      case 'Future': return 'green';
      default: return 'gray';
    }
  };

  if (isLoading) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading plant dashboard...</Text>
        </VStack>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container maxW="1200px" py={8}>
        <Alert status="error">
          <AlertIcon />
          Failed to load plant dashboard data
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="#1e3a8a">
          Plant Operations Dashboard
        </Heading>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Key Metrics */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Valves In Service</StatLabel>
                <StatNumber color="#10b981">{dashboardData.inServiceCount}</StatNumber>
                <StatHelpText>Currently operational</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pending Installation</StatLabel>
                <StatNumber color="#3b82f6">{dashboardData.pendingInstallation.length}</StatNumber>
                <StatHelpText>Ready for setup</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Scheduled Maintenance</StatLabel>
                <StatNumber color="#f59e0b">{dashboardData.scheduledMaintenance.length}</StatNumber>
                <StatHelpText>Upcoming service</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>In Repair</StatLabel>
                <StatNumber color="#ef4444">{dashboardData.inRepair.length}</StatNumber>
                <StatHelpText>Out of service</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Detailed Views */}
        <Card>
          <CardBody>
            <Tabs>
              <TabList>
                <Tab>Pending Installation ({dashboardData.pendingInstallation.length})</Tab>
                <Tab>Scheduled Maintenance ({dashboardData.scheduledMaintenance.length})</Tab>
                <Tab>In Repair ({dashboardData.inRepair.length})</Tab>
              </TabList>

              <TabPanels>
                {/* Pending Installation Tab */}
                <TabPanel px={0}>
                  {dashboardData.pendingInstallation.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <Text color="#64748b" fontSize="lg">
                        No valves pending installation
                      </Text>
                      <Text color="#64748b" fontSize="sm" mt={2}>
                        All delivered valves have been installed
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
                            <Th>Location</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {dashboardData.pendingInstallation.map((valve) => (
                            <Tr key={valve.id}>
                              <Td fontWeight="semibold">{valve.serialNumber}</Td>
                              <Td>
                                <Badge colorScheme="blue" variant="subtle">
                                  {valve.type}
                                </Badge>
                              </Td>
                              <Td>{valve.model}</Td>
                              <Td>{valve.location || 'TBD'}</Td>
                              <Td>
                                <Badge colorScheme="blue">
                                  Pending Installation
                                </Badge>
                              </Td>
                              <Td>
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  onClick={() => handleInstallValve(valve)}
                                >
                                  Install
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  )}
                </TabPanel>

                {/* Scheduled Maintenance Tab */}
                <TabPanel px={0}>
                  {dashboardData.scheduledMaintenance.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <Text color="#64748b" fontSize="lg">
                        No maintenance scheduled
                      </Text>
                      <Text color="#64748b" fontSize="sm" mt={2}>
                        All valves are up to date with maintenance
                      </Text>
                    </Box>
                  ) : (
                    <Box overflowX="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Serial Number</Th>
                            <Th>Location</Th>
                            <Th>Last Maintenance</Th>
                            <Th>Next Maintenance</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {dashboardData.scheduledMaintenance.map((valve) => (
                            <Tr key={valve.id}>
                              <Td fontWeight="semibold">{valve.serialNumber}</Td>
                              <Td>{valve.location}</Td>
                              <Td>
                                {valve.lastMaintenanceDate
                                  ? new Date(valve.lastMaintenanceDate).toLocaleDateString()
                                  : 'Never'
                                }
                              </Td>
                              <Td>
                                {valve.nextMaintenanceDate
                                  ? new Date(valve.nextMaintenanceDate).toLocaleDateString()
                                  : 'TBD'
                                }
                              </Td>
                              <Td>
                                <Badge 
                                  colorScheme={getMaintenanceStatusColor(getMaintenanceStatus(valve))}
                                >
                                  {getMaintenanceStatus(valve)}
                                </Badge>
                              </Td>
                              <Td>
                                <Button
                                  size="sm"
                                  colorScheme="orange"
                                  onClick={() => handleScheduleMaintenance(valve)}
                                >
                                  Schedule
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  )}
                </TabPanel>

                {/* In Repair Tab */}
                <TabPanel px={0}>
                  {dashboardData.inRepair.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <Text color="#64748b" fontSize="lg">
                        No valves in repair
                      </Text>
                      <Text color="#64748b" fontSize="sm" mt={2}>
                        All valves are operational or scheduled for maintenance
                      </Text>
                    </Box>
                  ) : (
                    <Box overflowX="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Serial Number</Th>
                            <Th>Location</Th>
                            <Th>Issue</Th>
                            <Th>Repair Start</Th>
                            <Th>Expected Return</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {dashboardData.inRepair.map((valve) => (
                            <Tr key={valve.id}>
                              <Td fontWeight="semibold">{valve.serialNumber}</Td>
                              <Td>{valve.location}</Td>
                              <Td>
                                <Text fontSize="sm">General repair</Text>
                              </Td>
                              <Td>
                                {valve.lastMaintenanceDate
                                  ? new Date(valve.lastMaintenanceDate).toLocaleDateString()
                                  : 'TBD'
                                }
                              </Td>
                              <Td>TBD</Td>
                              <Td>
                                <Badge colorScheme="red">
                                  In Repair
                                </Badge>
                              </Td>
                              <Td>
                                <Button
                                  size="sm"
                                  colorScheme="blue"
                                  variant="outline"
                                  onClick={() => handleViewRepair(valve)}
                                >
                                  View Details
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardBody>
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
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default PlantDashboard;