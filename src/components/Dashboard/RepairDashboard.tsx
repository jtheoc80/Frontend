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
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Input,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { ValveAsset, RepairRecord } from "../../types/valve";
import valveApiService from "../../services/valveApi";

const RepairDashboard = () => {
  const [valvesInRepair, setValvesInRepair] = useState<ValveAsset[]>([]);
  const [repairRecords, setRepairRecords] = useState<RepairRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedValve, setSelectedValve] = useState<ValveAsset | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Update repair form state
  const [repairUpdate, setRepairUpdate] = useState({
    status: '',
    notes: '',
    completionPercentage: 0,
    estimatedCompletion: ''
  });

  useEffect(() => {
    loadRepairData();
  }, []);

  const loadRepairData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Load valves in repair
      const valvesResponse = await valveApiService.getValvesInRepair();
      if (valvesResponse.success && valvesResponse.data) {
        setValvesInRepair(valvesResponse.data);
      }

      // Load repair records
      const recordsResponse = await valveApiService.getRepairRecords();
      if (recordsResponse.success && recordsResponse.data) {
        setRepairRecords(recordsResponse.data);
      }
    } catch (err) {
      setError("Failed to load repair dashboard data");
      console.error("Repair dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRepair = (valve: ValveAsset) => {
    setSelectedValve(valve);
    // Find corresponding repair record to pre-populate form
    const repairRecord = repairRecords.find(r => r.valveId === valve.id);
    if (repairRecord) {
      setRepairUpdate({
        status: repairRecord.status,
        notes: repairRecord.description,
        completionPercentage: repairRecord.status === 'completed' ? 100 : 
                             repairRecord.status === 'in_progress' ? 50 : 0,
        estimatedCompletion: repairRecord.expectedCompletionDate || ''
      });
    }
    onOpen();
  };

  const submitRepairUpdate = async () => {
    if (!selectedValve) return;
    
    console.log("Updating repair for valve:", selectedValve.serialNumber, repairUpdate);
    
    // In a real implementation, this would call an API to update the repair record
    // For now, we'll just update the local state
    setRepairRecords(records => 
      records.map(record => 
        record.valveId === selectedValve.id 
          ? { ...record, status: repairUpdate.status as any, description: repairUpdate.notes }
          : record
      )
    );
    
    onClose();
    setSelectedValve(null);
  };

  const getRepairProgress = (record: RepairRecord) => {
    const startDate = new Date(record.startDate);
    const today = new Date();
    const expectedEnd = record.expectedCompletionDate ? new Date(record.expectedCompletionDate) : null;
    
    if (!expectedEnd) return 0;
    
    const totalDays = (expectedEnd.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const daysElapsed = (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    
    return Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
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

  const getDaysInRepair = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    return Math.ceil((today.getTime() - start.getTime()) / (1000 * 3600 * 24));
  };

  if (isLoading) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading repair dashboard...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="#1e3a8a">
          Repair Services Dashboard
        </Heading>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Repair Statistics */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Valves in Repair</StatLabel>
                <StatNumber color="#ef4444">{valvesInRepair.length}</StatNumber>
                <StatHelpText>Currently out of service</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Active Repairs</StatLabel>
                <StatNumber color="#f59e0b">
                  {repairRecords.filter(r => r.status === 'in_progress').length}
                </StatNumber>
                <StatHelpText>In progress</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pending Requests</StatLabel>
                <StatNumber color="#3b82f6">
                  {repairRecords.filter(r => r.status === 'requested').length}
                </StatNumber>
                <StatHelpText>Awaiting assignment</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Completed This Month</StatLabel>
                <StatNumber color="#10b981">
                  {repairRecords.filter(r => r.status === 'completed').length}
                </StatNumber>
                <StatHelpText>Successfully repaired</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Current Repairs Table */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">Valves Currently in Repair Process</Heading>
                <Badge colorScheme="red" fontSize="sm">
                  {valvesInRepair.length} In Process
                </Badge>
              </HStack>

              {valvesInRepair.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color="#64748b" fontSize="lg">
                    No valves currently in repair
                  </Text>
                  <Text color="#64748b" fontSize="sm" mt={2}>
                    Great job! All valves are operational or scheduled for maintenance.
                  </Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Serial Number</Th>
                        <Th>Type</Th>
                        <Th>Location</Th>
                        <Th>Contractor</Th>
                        <Th>Days in Repair</Th>
                        <Th>Progress</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {valvesInRepair.map((valve) => {
                        const repairRecord = repairRecords.find(r => r.valveId === valve.id);
                        return (
                          <Tr key={valve.id}>
                            <Td fontWeight="semibold">{valve.serialNumber}</Td>
                            <Td>
                              <Badge colorScheme="blue" variant="subtle">
                                {valve.type}
                              </Badge>
                            </Td>
                            <Td>{valve.location || 'Unknown'}</Td>
                            <Td>{repairRecord?.contractorName || 'Unassigned'}</Td>
                            <Td>
                              {repairRecord ? getDaysInRepair(repairRecord.startDate) : 0} days
                            </Td>
                            <Td>
                              <Box>
                                <Progress
                                  value={repairRecord ? getRepairProgress(repairRecord) : 0}
                                  size="sm"
                                  colorScheme="orange"
                                  mb={1}
                                />
                                <Text fontSize="xs" color="#64748b">
                                  {repairRecord ? Math.round(getRepairProgress(repairRecord)) : 0}%
                                </Text>
                              </Box>
                            </Td>
                            <Td>
                              <Badge 
                                colorScheme={getStatusColor(repairRecord?.status || 'unknown')}
                              >
                                {repairRecord?.status || 'Unknown'}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={2}>
                                <Button
                                  size="sm"
                                  colorScheme="blue"
                                  onClick={() => handleUpdateRepair(valve)}
                                >
                                  Update
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  colorScheme="gray"
                                >
                                  View Details
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Recent Repair Activity */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Recent Repair Activity</Heading>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Valve ID</Th>
                      <Th>Contractor</Th>
                      <Th>Start Date</Th>
                      <Th>Expected Completion</Th>
                      <Th>Cost</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {repairRecords.slice(0, 5).map((record) => (
                      <Tr key={record.id}>
                        <Td>{record.valveId}</Td>
                        <Td>{record.contractorName}</Td>
                        <Td>{new Date(record.startDate).toLocaleDateString()}</Td>
                        <Td>
                          {record.expectedCompletionDate
                            ? new Date(record.expectedCompletionDate).toLocaleDateString()
                            : 'TBD'
                          }
                        </Td>
                        <Td>{record.cost ? `$${record.cost.toLocaleString()}` : 'TBD'}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardBody>
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
          </CardBody>
        </Card>
      </VStack>

      {/* Repair Update Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Repair Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedValve && (
              <VStack spacing={4} align="stretch">
                <Text>
                  <strong>Valve:</strong> {selectedValve.serialNumber} ({selectedValve.type})
                </Text>
                <Text>
                  <strong>Location:</strong> {selectedValve.location || 'Unknown'}
                </Text>
                
                <FormControl>
                  <FormLabel>Repair Status</FormLabel>
                  <select 
                    value={repairUpdate.status}
                    onChange={(e) => setRepairUpdate({...repairUpdate, status: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px' 
                    }}
                  >
                    <option value="requested">Requested</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </FormControl>

                <FormControl>
                  <FormLabel>Progress Percentage</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={repairUpdate.completionPercentage}
                    onChange={(e) => setRepairUpdate({
                      ...repairUpdate, 
                      completionPercentage: parseInt(e.target.value) || 0
                    })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Estimated Completion Date</FormLabel>
                  <Input
                    type="date"
                    value={repairUpdate.estimatedCompletion}
                    onChange={(e) => setRepairUpdate({
                      ...repairUpdate, 
                      estimatedCompletion: e.target.value
                    })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Repair Notes</FormLabel>
                  <Textarea
                    value={repairUpdate.notes}
                    onChange={(e) => setRepairUpdate({...repairUpdate, notes: e.target.value})}
                    placeholder="Enter repair details, issues found, work completed..."
                    rows={4}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={submitRepairUpdate}>
              Update Repair
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default RepairDashboard;