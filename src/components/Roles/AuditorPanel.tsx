import React, { useState } from "react";
import { Button, Input, VStack, Text, Box, useToast, Heading } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress";

const AuditorPanel = () => {
  const toast = useToast();
  const [serial, setSerial] = useState("");
  const [valveInfo, setValveInfo] = useState<any>(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetValve = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Required",
        description: "Please install MetaMask or another Web3 wallet to perform this action.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!serial.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid serial number.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      
      const info = await contract.getValveInfo(serial);
      setValveInfo(info);
      
      toast({
        title: "Success",
        description: "Valve information retrieved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error: any) {
      console.error('Failed to get valve info:', error);
      
      let errorMessage = 'Failed to retrieve valve information.';
      
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === -32603) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('valve not found')) {
        errorMessage = 'Valve not found. Please check the serial number.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogAudit = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Required",
        description: "Please install MetaMask or another Web3 wallet to perform this action.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!serial.trim() || !comments.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter both serial number and audit comments.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      
      const tx = await contract.logAudit(serial, comments);
      
      toast({
        title: "Transaction Submitted",
        description: "Audit log transaction has been submitted to the blockchain.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Audit event logged successfully on the blockchain.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      setSerial("");
      setComments("");
      
    } catch (error: any) {
      console.error('Failed to log audit:', error);
      
      let errorMessage = 'Failed to log audit event.';
      
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === -32603) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack align="start" spacing={4} mt={2}>
      <Heading size="sm" color="gray.600">Valve Audit</Heading>
      
      {/* Get Valve Info Section */}
      <VStack align="start" spacing={2} width="100%">
        <Text fontSize="sm" fontWeight="bold">Get Valve Information</Text>
        <Input
          placeholder="Serial Number"
          value={serial}
          onChange={e => setSerial(e.target.value)}
        />
        <Button 
          colorScheme="blue" 
          onClick={handleGetValve}
          isLoading={loading}
          loadingText="Retrieving..."
        >
          Get Valve Info
        </Button>
        
        {valveInfo && (
          <Box p={3} borderWidth={1} borderRadius="md" width="100%">
            <Text><strong>Owner:</strong> {valveInfo.owner}</Text>
            <Text><strong>Manufacturer:</strong> {valveInfo.manufacturer}</Text>
            <Text><strong>Status:</strong> {valveInfo.status}</Text>
            <Text><strong>Location:</strong> {valveInfo.location}</Text>
          </Box>
        )}
      </VStack>

      {/* Log Audit Section */}
      <VStack align="start" spacing={2} width="100%">
        <Text fontSize="sm" fontWeight="bold">Log Audit Event</Text>
        <Input
          placeholder="Serial Number"
          value={serial}
          onChange={e => setSerial(e.target.value)}
        />
        <Input
          placeholder="Audit Comments"
          value={comments}
          onChange={e => setComments(e.target.value)}
        />
        <Button 
          colorScheme="gray" 
          onClick={handleLogAudit}
          isLoading={loading}
          loadingText="Logging..."
        >
          Log Audit
        </Button>
      </VStack>
    </VStack>
  );
};

export default AuditorPanel;