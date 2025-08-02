import React, { useState } from "react";
import { Button, Input, VStack, Text, Box, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress";

const AuditorPanel = () => {
  const toast = useToast();
  const [serial, setSerial] = useState("");
  const [valveInfo, setValveInfo] = useState<any>(null);

  const handleGetValve = async () => {
    if (!window.ethereum) return toast(import React, { useState } from "react";
import { Button, Input, VStack, Heading, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress";

const AuditorPanel = () => {
  const toast = useToast();
  const [serial, setSerial] = useState("");
  const [comments, setComments] = useState("");

  const handleLogAudit = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.logAudit(serial, comments);
      await tx.wait();
      toast({ title: "Audit event logged!", status: "success" });
      setSerial("");
      setComments("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  return (
    <VStack align="start" spacing={4} mt={2}>
      <Heading size="sm" color="gray.600">Log Audit</Heading>
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
      <Button colorScheme="gray" onClick={handleLogAudit}>
        Log Audit
      </Button>
    </VStack>
  );
};

export default AuditorPanel;

