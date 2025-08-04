import React, { useState } from "react";
import { Button, Input, VStack, Box, Text } from "@chakra-ui/react";
import { BrowserProvider, Contract } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";
const CONTRACT_ADDRESS = "0xYourValveChainContractAddress";

const DistributorPanel = () => {
  const [serial, setSerial] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTransferValve = async () => {
    if (!window.ethereum) {
      setErrorMessage("No wallet found. Please install MetaMask or another Web3 wallet.");
      setSuccessMessage("");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const provider = new BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.transferValve(serial, toAddress);
      await tx.wait();
      setSuccessMessage("Valve transferred successfully!");
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during transfer.");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack align="start" spacing={4}>
      {successMessage && (
        <Box 
          p={4} 
          border="1px solid" 
          borderColor="green.200" 
          bg="green.50" 
          borderRadius="md"
          w="full"
        >
          <Text color="green.800">{successMessage}</Text>
        </Box>
      )}
      {errorMessage && (
        <Box 
          p={4} 
          border="1px solid" 
          borderColor="red.200" 
          bg="red.50" 
          borderRadius="md"
          w="full"
        >
          <Text color="red.800">{errorMessage}</Text>
        </Box>
      )}
      <Input placeholder="Serial Number" value={serial} onChange={e => setSerial(e.target.value)} />
      <Input placeholder="To Address" value={toAddress} onChange={e => setToAddress(e.target.value)} />
      <Button 
        colorScheme="blue" 
        onClick={handleTransferValve}
        isLoading={isLoading}
        loadingText="Transferring..."
      >
        Transfer Valve
      </Button>
    </VStack>
  );
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
