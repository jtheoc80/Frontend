import React, { useState } from "react";
import { Button, Input, VStack, Heading, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress";

const MaintenancePanel = () => {
  const toast = useToast();
  const [serial, setSerial] = useState("");
  const [desc, setDesc] = useState("");
  const [reportHash, setReportHash] = useState("");

  const handleLogMaintenance = async () => {
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

    if (!serial.trim() || !desc.trim() || !reportHash.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields (serial number, description, and report hash).",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      
      const tx = await contract.logMaintenance(serial, desc, reportHash);
      
      toast({
        title: "Transaction Submitted",
        description: "Maintenance log transaction has been submitted to the blockchain.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Maintenance logged successfully on the blockchain.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      setSerial("");
      setDesc("");
      setReportHash("");
      
    } catch (error: any) {
      console.error('Failed to log maintenance:', error);
      
      let errorMessage = 'Failed to log maintenance event.';
      
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
    }
  };

  return (
    <VStack align="start" spacing={4} mt={2}>
      <Heading size="sm" color="orange.600">Log Maintenance</Heading>
      <Input
        placeholder="Serial Number"
        value={serial}
        onChange={e => setSerial(e.target.value)}
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
      <Button colorScheme="orange" onClick={handleLogMaintenance}>
        Log Maintenance
      </Button>
    </VStack>
  );
};

export default MaintenancePanel;
