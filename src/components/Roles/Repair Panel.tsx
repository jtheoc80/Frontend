import React, { useState, useEffect } from "react";
import { 
  Button, 
  Input, 
  VStack, 
  Heading, 
  Text,
  Box,
  HStack,
  Textarea,
  Select,
  SimpleGrid
} from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";
import { valveApiService } from "../../services/valveApi";
import { TerminationRequest, TerminationRequestData } from "../../types/valve";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress"; // Update with your contract's address

const RepairPanel = () => {
  // Simple toast replacement
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    alert(`${type.toUpperCase()}: ${message}`);
  };
  
  // Repair logging state
  const [serial, setSerial] = useState("");
  const [preTest, setPreTest] = useState("");
  const [repairDetails, setRepairDetails] = useState("");
  const [postTest, setPostTest] = useState("");

  // Termination request state
  const [terminationSerial, setTerminationSerial] = useState("");
  const [terminationReason, setTerminationReason] = useState<'high_repair_cost' | 'beyond_economical_repair' | 'other'>('high_repair_cost');
  const [customReason, setCustomReason] = useState("");
  const [repairCost, setRepairCost] = useState<string>("0");
  const [newValveCost, setNewValveCost] = useState<string>("0");
  const [isSubmittingTermination, setIsSubmittingTermination] = useState(false);

  // Termination requests display state
  const [terminationRequests, setTerminationRequests] = useState<TerminationRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Load termination requests on mount
  useEffect(() => {
    loadTerminationRequests();
  }, []);

  const loadTerminationRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const result = await valveApiService.getTerminationRequests();
      if (result.success && result.data) {
        setTerminationRequests(result.data);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast("Failed to load termination requests", 'error');
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleLogRepair = async () => {
    if (!window.ethereum) return showToast("No wallet", 'error');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.logRepair(serial, preTest, repairDetails, postTest);
      await tx.wait();
      showToast("Repair logged!");
      // Clear form
      setSerial("");
      setPreTest("");
      setRepairDetails("");
      setPostTest("");
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleSubmitTermination = async () => {
    // Basic validation
    if (!terminationSerial) {
      showToast("Valve serial number is required", 'error');
      return;
    }

    if (terminationReason === 'other' && !customReason) {
      showToast("Custom reason is required", 'error');
      return;
    }

    if (terminationReason === 'high_repair_cost') {
      const repairCostNum = parseFloat(repairCost);
      const newValveCostNum = parseFloat(newValveCost);
      
      if (repairCostNum <= 0 || newValveCostNum <= 0) {
        showToast("Both repair cost and new valve cost must be greater than 0", 'error');
        return;
      }
      
      if (repairCostNum <= newValveCostNum) {
        showToast("Repair cost must be higher than new valve cost to justify termination", 'error');
        return;
      }
    }

    setIsSubmittingTermination(true);
    try {
      const terminationData: TerminationRequestData = {
        valveSerialNumber: terminationSerial,
        reason: terminationReason,
        customReason: terminationReason === 'other' ? customReason : undefined,
        repairCost: terminationReason === 'high_repair_cost' ? parseFloat(repairCost) : undefined,
        newValveCost: terminationReason === 'high_repair_cost' ? parseFloat(newValveCost) : undefined
      };

      const result = await valveApiService.submitTerminationRequest(
        terminationData, 
        'repair-user' // In a real app, this would come from authentication
      );

      if (result.success) {
        showToast("Termination request submitted for approval");
        
        // Clear form
        setTerminationSerial("");
        setTerminationReason('high_repair_cost');
        setCustomReason("");
        setRepairCost("0");
        setNewValveCost("0");
        
        // Reload requests
        await loadTerminationRequests();
      } else {
        showToast(result.message, 'error');
      }
    } catch (error: any) {
      showToast("Failed to submit termination request", 'error');
    } finally {
      setIsSubmittingTermination(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getApprovalStatus = (request: TerminationRequest) => {
    const repairApproved = request.approvals.repair?.approved;
    const plantApproved = request.approvals.plant?.approved;
    
    const statuses = [];
    if (request.approvals.repair) {
      statuses.push(`Repair: ${repairApproved ? '✓' : '✗'}`);
    } else {
      statuses.push('Repair: Pending');
    }
    
    if (request.approvals.plant) {
      statuses.push(`Plant: ${plantApproved ? '✓' : '✗'}`);
    } else {
      statuses.push('Plant: Pending');
    }
    
    return statuses.join(' | ');
  };

  return (
    <VStack align="start" spacing={6} mt={2}>
      {/* Repair Logging Section */}
      <VStack align="start" spacing={4} width="100%">
        <Heading size="md" color="purple.600">Log Repair</Heading>
        <Input
          placeholder="Serial Number"
          value={serial}
          onChange={e => setSerial(e.target.value)}
        />
        <Input
          placeholder="Pre-Test Report Hash"
          value={preTest}
          onChange={e => setPreTest(e.target.value)}
        />
        <Input
          placeholder="Repair Details Hash"
          value={repairDetails}
          onChange={e => setRepairDetails(e.target.value)}
        />
        <Input
          placeholder="Post-Test Report Hash"
          value={postTest}
          onChange={e => setPostTest(e.target.value)}
        />
        <Button colorScheme="purple" onClick={handleLogRepair}>
          Log Repair
        </Button>
      </VStack>

      {/* Divider */}
      <Box width="100%" height="1px" bg="gray.200" />

      {/* Valve Termination Request Section */}
      <VStack align="start" spacing={4} width="100%">
        <Heading size="md" color="red.600">Request Valve Termination</Heading>
        <Box p={3} bg="blue.50" borderRadius="md" width="100%">
          <Text fontSize="sm" color="blue.800">
            <strong>Termination Process:</strong> Request termination for valves that are beyond economical repair or have higher repair costs than replacement. 
            Requires approval from both Repair and Plant roles.
          </Text>
        </Box>
        
        <Input
          placeholder="Valve Serial Number"
          value={terminationSerial}
          onChange={e => setTerminationSerial(e.target.value)}
        />
        
        <Select
          value={terminationReason}
          onChange={e => setTerminationReason(e.target.value as any)}
        >
          <option value="high_repair_cost">High Repair Cost vs New Valve</option>
          <option value="beyond_economical_repair">Beyond Economical Repair (BER)</option>
          <option value="other">Other Reason</option>
        </Select>

        {terminationReason === 'other' && (
          <Textarea
            placeholder="Please specify the reason for termination..."
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
            rows={3}
          />
        )}

        {terminationReason === 'high_repair_cost' && (
          <SimpleGrid columns={2} spacing={4} width="100%">
            <Box>
              <Text fontSize="sm" mb={1}>Repair Cost ($)</Text>
              <Input
                type="number"
                value={repairCost}
                onChange={e => setRepairCost(e.target.value)}
                placeholder="0"
              />
            </Box>
            <Box>
              <Text fontSize="sm" mb={1}>New Valve Cost ($)</Text>
              <Input
                type="number"
                value={newValveCost}
                onChange={e => setNewValveCost(e.target.value)}
                placeholder="0"
              />
            </Box>
          </SimpleGrid>
        )}

        <Button 
          colorScheme="red" 
          onClick={handleSubmitTermination}
          isDisabled={isSubmittingTermination}
        >
          {isSubmittingTermination ? "Submitting..." : "Submit Termination Request"}
        </Button>
      </VStack>

      {/* Divider */}
      <Box width="100%" height="1px" bg="gray.200" />

      {/* Termination Requests Status */}
      <VStack align="start" spacing={4} width="100%">
        <HStack justify="space-between" width="100%">
          <Heading size="md" color="blue.600">Termination Requests Status</Heading>
          <Button 
            size="sm" 
            onClick={loadTerminationRequests}
            isDisabled={isLoadingRequests}
          >
            {isLoadingRequests ? "Loading..." : "Refresh"}
          </Button>
        </HStack>
        
        {terminationRequests.length === 0 ? (
          <Text color="gray.500" fontStyle="italic">No termination requests found</Text>
        ) : (
          <VStack spacing={3} width="100%">
            {terminationRequests.map((request) => (
              <Box key={request.id} width="100%" p={4} borderWidth={1} borderRadius="md" bg="gray.50">
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" width="100%">
                    <Text fontWeight="bold">Valve: {request.valveSerialNumber}</Text>
                    <Text 
                      px={2} 
                      py={1} 
                      borderRadius="md" 
                      bg={`${getStatusColor(request.status)}.100`}
                      color={`${getStatusColor(request.status)}.800`}
                      fontSize="sm"
                    >
                      {request.status.toUpperCase()}
                    </Text>
                  </HStack>
                  
                  <Text fontSize="sm">
                    <strong>Reason:</strong> {request.reason === 'other' ? request.customReason : 
                      request.reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                  
                  {request.repairCost && request.newValveCost && (
                    <Text fontSize="sm">
                      <strong>Cost Analysis:</strong> Repair: ${request.repairCost} | New: ${request.newValveCost}
                    </Text>
                  )}
                  
                  <Text fontSize="sm">
                    <strong>Approval Status:</strong> {getApprovalStatus(request)}
                  </Text>
                  
                  <Text fontSize="xs" color="gray.500">
                    Requested: {new Date(request.requestDate).toLocaleDateString()}
                  </Text>
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default RepairPanel;
