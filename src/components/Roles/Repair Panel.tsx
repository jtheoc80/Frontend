import React, { useState, useEffect } from "react";
import { 
  Button, 
  Input, 
  VStack, 
  useToast, 
  Heading, 
  Divider, 
  Select, 
  Textarea, 
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  Text,
  Badge,
  HStack,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";
import { valveApiService } from "../../services/valveApi";
import { TerminationRequest, TerminationRequestData } from "../../types/valve";
import { validateTerminationReason, validateCostComparison, formatValidationErrors } from "../../utils/validation";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress"; // Update with your contract's address

const RepairPanel = () => {
  const toast = useToast();
  
  // Repair logging state
  const [serial, setSerial] = useState("");
  const [preTest, setPreTest] = useState("");
  const [repairDetails, setRepairDetails] = useState("");
  const [postTest, setPostTest] = useState("");

  // Termination request state
  const [terminationSerial, setTerminationSerial] = useState("");
  const [terminationReason, setTerminationReason] = useState<'high_repair_cost' | 'beyond_economical_repair' | 'other'>('high_repair_cost');
  const [customReason, setCustomReason] = useState("");
  const [repairCost, setRepairCost] = useState<number>(0);
  const [newValveCost, setNewValveCost] = useState<number>(0);
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
        toast({
          title: "Error loading termination requests",
          description: result.message,
          status: "error"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load termination requests",
        status: "error"
      });
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleLogRepair = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.logRepair(serial, preTest, repairDetails, postTest);
      await tx.wait();
      toast({ title: "Repair logged!", status: "success" });
      // Clear form
      setSerial("");
      setPreTest("");
      setRepairDetails("");
      setPostTest("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  const handleSubmitTermination = async () => {
    // Validate form data
    const reasonValidation = validateTerminationReason(terminationReason, customReason);
    const costValidation = terminationReason === 'high_repair_cost' ? 
      validateCostComparison(repairCost, newValveCost) : { isValid: true, errors: [] };

    const allErrors = [...reasonValidation.errors, ...costValidation.errors];
    
    if (allErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: formatValidationErrors(allErrors),
        status: "error",
        duration: 5000
      });
      return;
    }

    setIsSubmittingTermination(true);
    try {
      const terminationData: TerminationRequestData = {
        valveSerialNumber: terminationSerial,
        reason: terminationReason,
        customReason: terminationReason === 'other' ? customReason : undefined,
        repairCost: terminationReason === 'high_repair_cost' ? repairCost : undefined,
        newValveCost: terminationReason === 'high_repair_cost' ? newValveCost : undefined
      };

      const result = await valveApiService.submitTerminationRequest(
        terminationData, 
        'repair-user' // In a real app, this would come from authentication
      );

      if (result.success) {
        toast({
          title: "Termination Request Submitted",
          description: "The termination request has been submitted for approval",
          status: "success"
        });
        
        // Clear form
        setTerminationSerial("");
        setTerminationReason('high_repair_cost');
        setCustomReason("");
        setRepairCost(0);
        setNewValveCost(0);
        
        // Reload requests
        await loadTerminationRequests();
      } else {
        toast({
          title: "Error",
          description: result.message,
          status: "error",
          duration: 5000
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit termination request",
        status: "error"
      });
    } finally {
      setIsSubmittingTermination(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow';
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
    <VStack align="start" spacing={6} mt={2} divider={<Divider />}>
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

      {/* Valve Termination Request Section */}
      <VStack align="start" spacing={4} width="100%">
        <Heading size="md" color="red.600">Request Valve Termination</Heading>
        <Alert status="info" size="sm">
          <AlertIcon />
          <Box>
            <AlertTitle>Termination Process</AlertTitle>
            <AlertDescription>
              Request termination for valves that are beyond economical repair or have higher repair costs than replacement. 
              Requires approval from both Repair and Plant roles.
            </AlertDescription>
          </Box>
        </Alert>
        
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
          <HStack spacing={4} width="100%">
            <Box flex={1}>
              <Text fontSize="sm" mb={1}>Repair Cost ($)</Text>
              <NumberInput
                value={repairCost}
                onChange={(_, value) => setRepairCost(value || 0)}
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <Box flex={1}>
              <Text fontSize="sm" mb={1}>New Valve Cost ($)</Text>
              <NumberInput
                value={newValveCost}
                onChange={(_, value) => setNewValveCost(value || 0)}
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </HStack>
        )}

        <Button 
          colorScheme="red" 
          onClick={handleSubmitTermination}
          isLoading={isSubmittingTermination}
          loadingText="Submitting..."
        >
          Submit Termination Request
        </Button>
      </VStack>

      {/* Termination Requests Status */}
      <VStack align="start" spacing={4} width="100%">
        <HStack justify="space-between" width="100%">
          <Heading size="md" color="blue.600">Termination Requests Status</Heading>
          <Button 
            size="sm" 
            onClick={loadTerminationRequests}
            isLoading={isLoadingRequests}
          >
            Refresh
          </Button>
        </HStack>
        
        {terminationRequests.length === 0 ? (
          <Text color="gray.500" fontStyle="italic">No termination requests found</Text>
        ) : (
          <VStack spacing={3} width="100%">
            {terminationRequests.map((request) => (
              <Card key={request.id} width="100%" size="sm">
                <CardBody>
                  <VStack align="start" spacing={2}>
                    <HStack justify="space-between" width="100%">
                      <Text fontWeight="bold">Valve: {request.valveSerialNumber}</Text>
                      <Badge colorScheme={getStatusBadgeColor(request.status)}>
                        {request.status.toUpperCase()}
                      </Badge>
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
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default RepairPanel;
