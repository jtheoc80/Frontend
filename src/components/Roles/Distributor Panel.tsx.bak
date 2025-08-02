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
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.transferValve(serial, toAddress);
      await tx.wait();
      toast({ title: "Transferred!", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
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
