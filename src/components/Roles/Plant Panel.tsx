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

    if (!serialInstall.trim() || !location.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter both serial number and location.",
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
      
      const tx = await contract.installValve(serialInstall, location);
      
      toast({
        title: "Transaction Submitted",
        description: "Valve installation transaction has been submitted to the blockchain.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Valve installed successfully on the blockchain.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      setSerialInstall("");
      setLocation("");
      
    } catch (error: any) {
      console.error('Failed to install valve:', error);
      
      let errorMessage = 'Failed to install valve.';
      
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === -32603) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message?.includes('not authorized')) {
        errorMessage = 'You are not authorized to install this valve.';
      } else if (error.message?.includes('valve not found')) {
        errorMessage = 'Valve not found. Please check the serial number.';
      } else if (error.message?.includes('already installed')) {
        errorMessage = 'Valve is already installed.';
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

  // Log Maintenance
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

    if (!serialMaint.trim() || !desc.trim() || !reportHash.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all maintenance fields (serial number, description, and report hash).",
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
      
      const tx = await contract.logMaintenance(serialMaint, desc, reportHash);
      
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
      
      setSerialMaint("");
      setDesc("");
      setReportHash("");
      
    } catch (error: any) {
      console.error('Failed to log maintenance:', error);
      
      let errorMessage = 'Failed to log maintenance.';
      
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === -32603) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message?.includes('not authorized')) {
        errorMessage = 'You are not authorized to log maintenance for this valve.';
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

  // Request Repair with Escrow Payment
  const handleRequestRepair = async () => {
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

    if (!serialRepair.trim() || !contractor.trim() || !amount.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all repair request fields (serial number, contractor address, and payment amount).",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate Ethereum address
    if (!ethers.utils.isAddress(contractor)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address for the contractor.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate amount
    try {
      ethers.utils.parseEther(amount);
    } catch {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount in ETH.",
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

      const tx = await contract.requestRepair(
        serialRepair,
        contractor,
        {
          value: ethers.utils.parseEther(amount) // Amount in ETH
        }
      );
      
      toast({
        title: "Transaction Submitted",
        description: "Repair request and escrow transaction has been submitted to the blockchain.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Repair requested and payment escrowed successfully on the blockchain.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      setSerialRepair("");
      setContractor("");
      setAmount("");
      
    } catch (error: any) {
      console.error('Failed to request repair:', error);
      
      let errorMessage = 'Failed to request repair.';
      
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === -32603) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction and escrow payment.';
      } else if (error.message?.includes('not authorized')) {
        errorMessage = 'You are not authorized to request repairs for this valve.';
      } else if (error.message?.includes('valve not found')) {
        errorMessage = 'Valve not found. Please check the serial number.';
      } else if (error.message?.includes('already in repair')) {
        errorMessage = 'This valve is already in repair.';
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

  // Confirm Repair (release payment)
  const handleConfirmRepair = async () => {
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

    if (!serialConfirm.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter the serial number of the valve to confirm repair.",
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

      const tx = await contract.confirmRepair(serialConfirm);
      
      toast({
        title: "Transaction Submitted",
        description: "Repair confirmation transaction has been submitted to the blockchain.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      
      await tx.wait();
      
      toast({
        title: "Success",
        description: "Repair confirmed and payment released successfully on the blockchain.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      setSerialConfirm("");
      
    } catch (error: any) {
      console.error('Failed to confirm repair:', error);
      
      let errorMessage = 'Failed to confirm repair.';
      
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === -32603) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message?.includes('not authorized')) {
        errorMessage = 'You are not authorized to confirm repairs for this valve.';
      } else if (error.message?.includes('valve not found')) {
        errorMessage = 'Valve not found. Please check the serial number.';
      } else if (error.message?.includes('no repair to confirm')) {
        errorMessage = 'No pending repair found for this valve.';
      } else if (error.message?.includes('already confirmed')) {
        errorMessage = 'Repair has already been confirmed.';
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
