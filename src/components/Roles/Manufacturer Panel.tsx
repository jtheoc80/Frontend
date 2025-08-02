// src/components/roles/ManufacturerPanel.tsx
import React, { useState } from "react";
import { Button, Input, VStack, useToast, Heading } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress";

const ManufacturerPanel = () => {
  const toast = useToast();
  const [serial, setSerial] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterValve = async () => {
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

    if (!serial.trim() || !details.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter both serial number and valve details.",
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
      
      const tx = await contract.registerValve(serial, details);
      
      toast({
        title: "Transaction Submitted",
        description: "Valve registration transaction has been submitted to the blockchain.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Valve registered successfully on the blockchain.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      setSerial("");
      setDetails("");
      
    } catch (error: any) {
      console.error('Failed to register valve:', error);
      
      let errorMessage = 'Failed to register valve.';
      
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === -32603) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message?.includes('already exists')) {
        errorMessage = 'Valve with this serial number already exists.';
      } else if (error.message?.includes('not authorized')) {
        errorMessage = 'You are not authorized to register valves.';
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
      <Heading size="sm" color="teal.600">Register New Valve</Heading>
      <Input 
        placeholder="Serial Number" 
        value={serial} 
        onChange={e => setSerial(e.target.value)} 
      />
      <Input 
        placeholder="Valve Details (specs/IPFS hash)" 
        value={details} 
        onChange={e => setDetails(e.target.value)} 
      />
      <Button 
        colorScheme="teal" 
        onClick={handleRegisterValve}
        isLoading={loading}
        loadingText="Registering..."
      >
        Register Valve
      </Button>
    </VStack>
  );
};

export default ManufacturerPanel;
