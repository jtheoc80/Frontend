// src/components/roles/ManufacturerPanel.tsx
import React, { useState } from "react";
import { Button, Input, VStack, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress";

const ManufacturerPanel = () => {
  const toast = useToast();
  const [serial, setSerial] = useState("");
  const [details, setDetails] = useState("");

  const handleRegisterValve = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.registerValve(serial, details);
      await tx.wait();
      toast({ title: "Valve registered!", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  return (
    <VStack align="start" spacing={4}>
      <Input placeholder="Serial Number" value={serial} onChange={e => setSerial(e.target.value)} />
      <Input placeholder="Valve Details (specs/IPFS hash)" value={details} onChange={e => setDetails(e.target.value)} />
      <Button colorScheme="teal" onClick={handleRegisterValve}>Register Valve</Button>
    </VStack>
  );
};

export default ManufacturerPanel;
