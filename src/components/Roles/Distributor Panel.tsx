import React, { useState } from "react";
import { Button, Input, VStack, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";
const CONTRACT_ADDRESS = "0xYourValveChainContractAddress";

const DistributorPanel = () => {
  const toast = useToast();
  const [serial, setSerial] = useState("");
  const [toAddress, setToAddress] = useState("");

  const handleTransferValve = async () => {
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

    if (!serial.trim() || !toAddress.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter both serial number and destination address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Basic address validation
    if (!ethers.utils.isAddress(toAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address.",
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
      
      const tx = await contract.transferValve(serial, toAddress);
      
      toast({
        title: "Transaction Submitted",
        description: "Valve transfer transaction has been submitted to the blockchain.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Valve transferred successfully on the blockchain.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      setSerial("");
      setToAddress("");
      
    } catch (error: any) {
      console.error('Failed to transfer valve:', error);
      
      let errorMessage = 'Failed to transfer valve.';
      
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === -32603) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message?.includes('not authorized')) {
        errorMessage = 'You are not authorized to transfer this valve.';
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
    }
  };

  return (
    <VStack align="start" spacing={4}>
      <Input placeholder="Serial Number" value={serial} onChange={e => setSerial(e.target.value)} />
      <Input placeholder="To Address" value={toAddress} onChange={e => setToAddress(e.target.value)} />
      <Button colorScheme="blue" onClick={handleTransferValve}>Transfer Valve</Button>
    </VStack>
  );
};

export default DistributorPanel;
