import React, { useState, useEffect } from "react";
import { 
  Button, 
  Input, 
  VStack, 
  Heading, 
  useToast, 
  Divider,
  Text,
  Badge,
  HStack,
  Card,
  CardBody,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box
} from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";
import { valveApiService } from "../../services/valveApi";
import { TerminationRequest, TerminationApprovalData } from "../../types/valve";
import { validateApprovalComments } from "../../utils/validation";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress"; // Update this

const PlantPanel = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Install Valve
  const [serialInstall, setSerialInstall] = useState("");
  const [location, setLocation] = useState("");

  // Log Maintenance
  const [serialMaint, setSerialMaint] = useState("");
  const [desc, setDesc] = useState("");
  const [reportHash, setReportHash] = useState("");

  // Repair Request
  const [serialRepair, setSerialRepair] = useState("");
  const [contractor, setContractor] = useState("");
  const [amount, setAmount] = useState("");

  // Confirm Repair
  const [serialConfirm, setSerialConfirm] = useState("");

  // Termination approval state
  const [terminationRequests, setTerminationRequests] = useState<TerminationRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TerminationRequest | null>(null);
  const [approvalComments, setApprovalComments] = useState("");
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

  // Load termination requests on mount
  useEffect(() => {
    loadTerminationRequests();
  }, []);

  const loadTerminationRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const result = await valveApiService.getTerminationRequests();
      if (result.success && result.data) {
        // Filter to show only requests that need plant approval or are pending
        const relevantRequests = result.data.filter(r => 
          r.status === 'pending' || !r.approvals.plant
        );
        setTerminationRequests(relevantRequests);
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

  // --- Blockchain Functions ---

  // Install Valve
  const handleInstallValve = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.installValve(serialInstall, location);
      await tx.wait();
      toast({ title: "Valve installed!", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  // Log Maintenance
  const handleLogMaintenance = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.logMaintenance(serialMaint, desc, reportHash);
      await tx.wait();
      toast({ title: "Maintenance logged!", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  // Request Repair with Escrow Payment
  const handleRequestRepair = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.requestRepair(
        serialRepair,
        contractor,
        {
          value: ethers.utils.parseEther(amount) // Amount in ETH
        }
      );
      await tx.wait();
      toast({ title: "Repair requested and payment escrowed!", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  // Confirm Repair (release payment)
  const handleConfirmRepair = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.confirmRepair(serialConfirm);
      await tx.wait();
      toast({ title: "Repair confirmed and payment released!", status: "success" });
      setSerialConfirm("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  const openApprovalModal = (request: TerminationRequest) => {
    setSelectedRequest(request);
    setApprovalComments("");
    onOpen();
  };

  const handleApproval = async (approved: boolean) => {
    if (!selectedRequest) return;

    // Validate comments if provided
    const validation = validateApprovalComments(approvalComments);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        status: "error"
      });
      return;
    }

    setIsSubmittingApproval(true);
    try {
      const approvalData: TerminationApprovalData = {
        terminationRequestId: selectedRequest.id,
        role: 'plant',
        approved,
        comments: approvalComments.trim() || undefined
      };

      const result = await valveApiService.submitTerminationApproval(
        approvalData,
        'plant-user' // In a real app, this would come from authentication
      );

      if (result.success) {
        toast({
          title: `Termination ${approved ? 'Approved' : 'Rejected'}`,
          description: "Your approval has been recorded",
          status: "success"
        });
        
        onClose();
        await loadTerminationRequests();
      } else {
        toast({
          title: "Error",
          description: result.message,
          status: "error"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit approval",
        status: "error"
      });
    } finally {
      setIsSubmittingApproval(false);
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

  const canApprove = (request: TerminationRequest) => {
    return !request.approvals.plant && request.status === 'pending';
  };

  // --- Render ---
  return (
    <>
      <VStack align="start" spacing={8} mt={2} divider={<Divider />}>
        {/* Install Valve */}
        <VStack align="start" spacing={2}>
          <Heading size="sm" color="teal.600">Install Valve</Heading>
          <Input
            placeholder="Serial Number"
            value={serialInstall}
            onChange={e => setSerialInstall(e.target.value)}
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <Button colorScheme="green" onClick={handleInstallValve}>Install Valve</Button>
        </VStack>

        {/* Log Maintenance */}
        <VStack align="start" spacing={2}>
          <Heading size="sm" color="orange.600">Log Maintenance</Heading>
          <Input
            placeholder="Serial Number"
            value={serialMaint}
            onChange={e => setSerialMaint(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <Input
            placeholder="Report Hash (IPFS or SHA256)"
            value={reportHash}
            onChange={e => setReportHash(e.target.value)}
          />
          <Button colorScheme="orange" onClick={handleLogMaintenance}>Log Maintenance</Button>
        </VStack>

        {/* Request Repair & Escrow Payment */}
        <VStack align="start" spacing={2}>
          <Heading size="sm" color="red.600">Request Repair & Escrow Payment</Heading>
          <Input
            placeholder="Serial Number"
            value={serialRepair}
            onChange={e => setSerialRepair(e.target.value)}
          />
          <Input
            placeholder="Contractor Address"
            value={contractor}
            onChange={e => setContractor(e.target.value)}
          />
          <Input
            placeholder="Amount (ETH)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <Button colorScheme="red" onClick={handleRequestRepair}>
            Request Repair & Escrow Payment
          </Button>
        </VStack>

        {/* Confirm Repair (release payment) */}
        <VStack align="start" spacing={2}>
          <Heading size="sm" color="blue.600">Confirm Repair (Release Payment)</Heading>
          <Input
            placeholder="Serial Number"
            value={serialConfirm}
            onChange={e => setSerialConfirm(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleConfirmRepair}>
            Confirm Repair & Release Payment
          </Button>
        </VStack>

        {/* Termination Approval Section */}
        <VStack align="start" spacing={4} width="100%">
          <HStack justify="space-between" width="100%">
            <Heading size="sm" color="purple.600">Valve Termination Requests</Heading>
            <Button 
              size="sm" 
              onClick={loadTerminationRequests}
              isLoading={isLoadingRequests}
            >
              Refresh
            </Button>
          </HStack>
          
          <Alert status="info" size="sm">
            <AlertIcon />
            <Box>
              <AlertTitle>Plant Approval Required</AlertTitle>
              <AlertDescription>
                Review and approve/reject valve termination requests. Both Plant and Repair approvals are required for termination.
              </AlertDescription>
            </Box>
          </Alert>
          
          {terminationRequests.length === 0 ? (
            <Text color="gray.500" fontStyle="italic">No termination requests pending your approval</Text>
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
                        <strong>Requested By:</strong> {request.requestedBy}
                      </Text>
                      
                      <Text fontSize="sm">
                        <strong>Approval Status:</strong> {getApprovalStatus(request)}
                      </Text>
                      
                      <Text fontSize="xs" color="gray.500">
                        Requested: {new Date(request.requestDate).toLocaleDateString()}
                      </Text>

                      {canApprove(request) && (
                        <Button 
                          size="sm" 
                          colorScheme="purple" 
                          onClick={() => openApprovalModal(request)}
                        >
                          Review & Approve
                        </Button>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>
      </VStack>

      {/* Approval Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Review Termination Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRequest && (
              <VStack align="start" spacing={4}>
                <Text><strong>Valve:</strong> {selectedRequest.valveSerialNumber}</Text>
                <Text><strong>Reason:</strong> {selectedRequest.reason === 'other' ? selectedRequest.customReason : 
                  selectedRequest.reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                
                {selectedRequest.repairCost && selectedRequest.newValveCost && (
                  <Text><strong>Cost Analysis:</strong> Repair: ${selectedRequest.repairCost} | New: ${selectedRequest.newValveCost}</Text>
                )}
                
                <Text><strong>Requested By:</strong> {selectedRequest.requestedBy}</Text>
                <Text><strong>Request Date:</strong> {new Date(selectedRequest.requestDate).toLocaleDateString()}</Text>
                
                {selectedRequest.approvals.repair && (
                  <Alert status={selectedRequest.approvals.repair.approved ? "success" : "error"} size="sm">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Repair Team {selectedRequest.approvals.repair.approved ? 'Approved' : 'Rejected'}</AlertTitle>
                      {selectedRequest.approvals.repair.comments && (
                        <AlertDescription>{selectedRequest.approvals.repair.comments}</AlertDescription>
                      )}
                    </Box>
                  </Alert>
                )}
                
                <Textarea
                  placeholder="Add comments for your approval decision (optional)"
                  value={approvalComments}
                  onChange={e => setApprovalComments(e.target.value)}
                  rows={3}
                />
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                colorScheme="red" 
                onClick={() => handleApproval(false)}
                isLoading={isSubmittingApproval}
              >
                Reject
              </Button>
              <Button 
                colorScheme="green" 
                onClick={() => handleApproval(true)}
                isLoading={isSubmittingApproval}
              >
                Approve
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlantPanel;
