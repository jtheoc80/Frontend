import React, { useState } from "react";
import { Button, Input, VStack, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress"; // Update with your contract's address

const RepairPanel = () => {
  const toast = useToast();
  const [serial, setSerial] = useState("");
  const [preTest, setPreTest] = useState("");
  const [repairDetails, setRepairDetails] = useState("");
  const [postTest, setPostTest] = useState("");

  const handleLogRepair = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.logRepair(serial, preTest, repairDetails, postTest);
      await tx.wait();
      toast({ title: "Repair logged!", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  return (
    <VStack align="start" spacing={4} mt={2}>
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
      <Button colorScheme="purple" onClick={handleLogRepair}>
        Log Repair
      </Button>
    </VStack>
  );
};

export default RepairPanel;
