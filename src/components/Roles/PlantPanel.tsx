import React, { useState } from "react";
import { Button, Input, VStack, Heading, useToast, Divider } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress"; // Update this

const PlantPanel = () => {
  const toast = useToast();

  // Install Valve
  const [serialInstall, setSerialInstall] = useState("");
  const [location, setLocation] = useState("");

  // Log Maintenance
  const [serialMaint, setSerialMaint] = useState("");
  const [desc, setDesc] = useState("");
  const [reportHash, setReportHash] = useState("");

  // Repair Request
  const [serialRepair, setSerialRepair] = useState("");
  const [contractor, setContractor] = useState("");
  const [amount, setAmount] = useState("");

  // Confirm Repair
  const [serialConfirm, setSerialConfirm] = useState("");

  // --- Blockchain Functions ---

  // Install Valve
  const handleInstallValve = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.installValve(serialInstall, location);
      await tx.wait();
      toast({ title: "Valve installed!", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  // Log Maintenance
  const handleLogMaintenance = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.logMaintenance(serialMaint, desc, reportHash);
      await tx.wait();
      toast({ title: "Maintenance logged!", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  // Request Repair with Escrow Payment
  const handleRequestRepair = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.requestRepair(
        serialRepair,
        contractor,
        {
          value: ethers.utils.parseEther(amount) // Amount in ETH
        }
      );
      await tx.wait();
      toast({ title: "Repair requested and payment escrowed!", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  // Confirm Repair (release payment)
  const handleConfirmRepair = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.confirmRepair(serialConfirm);
      await tx.wait();
      toast({ title: "Repair confirmed and payment released!", status: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  // --- Render ---
  return (
    <VStack align="start" spacing={8} mt={2} divider={<Divider />}>
      {/* Install Valve */}
      <VStack align="start" spacing={2}>
        <Heading size="sm" color="teal.600">Install Valve</Heading>
        <Input
          placeholder="Serial Number"
          value={serialInstall}
          onChange={e => setSerialInstall(e.target.value)}
        />
        <Input
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <Button colorScheme="green" onClick={handleInstallValve}>Install Valve</Button>
      </VStack>

      {/* Log Maintenance */}
      <VStack align="start" spacing={2}>
        <Heading size="sm" color="orange.600">Log Maintenance</Heading>
        <Input
          placeholder="Serial Number"
          value={serialMaint}
          onChange={e => setSerialMaint(e.target.value)}
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
        <Button colorScheme="orange" onClick={handleLogMaintenance}>Log Maintenance</Button>
      </VStack>

      {/* Request Repair & Escrow Payment */}
      <VStack align="start" spacing={2}>
        <Heading size="sm" color="red.600">Request Repair & Escrow Payment</Heading>
        <Input
          placeholder="Serial Number"
          value={serialRepair}
          onChange={e => setSerialRepair(e.target.value)}
        />
        <Input
          placeholder="Contractor Address"
          value={contractor}
          onChange={e => setContractor(e.target.value)}
        />
        <Input
          placeholder="Amount (ETH)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <Button colorScheme="red" onClick={handleRequestRepair}>
          Request Repair & Escrow Payment
        </Button>
      </VStack>

      {/* Confirm Repair (release payment) */}
      <VStack align="start" spacing={2}>
        <Heading size="sm" color="blue.600">Confirm Repair (Release Payment)</Heading>
        <Input
          placeholder="Serial Number"
          value={serialConfirm}
          onChange={e => setSerialConfirm(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleConfirmRepair}>
          Confirm Repair & Release Payment
        </Button>
      </VStack>
    </VStack>
  );
};

export default PlantPanel;
