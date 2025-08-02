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
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.logMaintenance(serial, desc, reportHash);
      await tx.wait();
      toast({ title: "Maintenance logged!", status: "success" });
      setSerial("");
      setDesc("");
      setReportHash("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
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
