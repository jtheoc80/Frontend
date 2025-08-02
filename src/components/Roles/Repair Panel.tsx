import React, { useState } from "react";
import { Button, Input, VStack, useToast, Heading } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress"; // Update with your contract's address

const RepairPanel = () => {
  const toast = useToast();
  const [serial, setSerial] = useState("");
  const [preTest, setPreTest] = useState("");
  const [repairDetails, setRepairDetails] = useState("");
  const [postTest, setPostTest] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogRepair = async () => {
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

    if (!serial.trim() || !preTest.trim() || !repairDetails.trim() || !postTest.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields (serial number, pre-test, repair details, and post-test).",
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
      
      const tx = await contract.logRepair(serial, preTest, repairDetails, postTest);
      
      toast({
        title: "Transaction Submitted",
        description: "Repair log transaction has been submitted to the blockchain.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Repair logged successfully on the blockchain.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      setSerial("");
      setPreTest("");
      setRepairDetails("");
      setPostTest("");
      
    } catch (error: any) {
      console.error('Failed to log repair:', error);
      
      let errorMessage = 'Failed to log repair.';
      
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === -32603) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message?.includes('not authorized')) {
        errorMessage = 'You are not authorized to log repairs for this valve.';
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

  return (
    <VStack align="start" spacing={4} mt={2}>
      <Heading size="sm" color="purple.600">Log Repair</Heading>
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
      <Button 
        colorScheme="purple" 
        onClick={handleLogRepair}
        isLoading={loading}
        loadingText="Logging..."
      >
        Log Repair
      </Button>
    </VStack>
  );
};

export default RepairPanel;
