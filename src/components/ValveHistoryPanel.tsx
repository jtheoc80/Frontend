import React, { useState } from "react";
import { Box, Input, Button, VStack, Heading, Text, SimpleGrid, Divider, Spinner, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import contractABI from "../../abi/ValveChainABI.json";

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress"; // Update as needed

const ValveHistoryPanel = () => {
  const toast = useToast();
  const [serial, setSerial] = useState("");
  const [loading, setLoading] = useState(false);
  const [valveInfo, setValveInfo] = useState<any>(null);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [repair, setRepair] = useState<any>(null);

  const handleFetchHistory = async () => {
    if (!window.ethereum) return toast({ title: "No wallet", status: "error" });
    setLoading(true);
    setValveInfo(null);
    setMaintenance([]);
    setRepair(null);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

      // 1. Get Valve Info
      const valve = await contract.getValve(serial);
      setValveInfo(valve);

      // 2. Get Maintenance History
      const maint = await contract.getMaintenanceHistory(serial);
      setMaintenance(maint);

      // 3. Get Repair Request/Status
      const repairReq = await contract.getRepairRequest(serial);
      setRepair(repairReq);

    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
    setLoading(false);
  };

  // Helper to pretty-print states (if needed)
  const stateToStr = (s: number) =>
    ["Manufactured", "AtDistributor", "AtPlant", "Installed", "NeedsRepair", "UnderRepair", "InService"][s] || "Unknown";

  return (
    <Box mt={6} p={4} borderWidth={1} borderRadius="lg" shadow="md">
      <Heading size="md" mb={3}>Valve History Viewer</Heading>
      <VStack align="start" spacing={2} mb={4}>
        <Input
          placeholder="Enter Serial Number"
          value={serial}
          onChange={e => setSerial(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleFetchHistory} isLoading={loading}>
          View History
        </Button>
      </VStack>

      {loading && <Spinner />}
      
      {valveInfo && (
        <Box mb={4}>
          <Heading size="sm">Valve Details</Heading>
          <SimpleGrid columns={2} spacing={2}>
            <Text><b>Serial:</b></Text> <Text>{valveInfo[0]}</Text>
            <Text><b>Manufacturer:</b></Text> <Text>{valveInfo[1]}</Text>
            <Text><b>Current Owner:</b></Text> <Text>{valveInfo[2]}</Text>
            <Text><b>Details:</b></Text> <Text>{valveInfo[3]}</Text>
            <Text><b>State:</b></Text> <Text>{stateToStr(valveInfo[4])}</Text>
          </SimpleGrid>
        </Box>
      )}

      {maintenance.length > 0 && (
        <Box mb={4}>
          <Heading size="sm">Maintenance History</Heading>
          <Divider my={2} />
          {maintenance.map((m, idx) => (
            <Box key={idx} p={2} mb={2} borderWidth={1} borderRadius="md">
              <Text><b>Date:</b> {new Date(Number(m.timestamp) * 1000).toLocaleString()}</Text>
              <Text><b>By:</b> {m.performedBy}</Text>
              <Text><b>Description:</b> {m.description}</Text>
              <Text><b>Report Hash:</b> {m.reportHash}</Text>
            </Box>
          ))}
        </Box>
      )}

      {repair && repair[0] && (
        <Box mb={4}>
          <Heading size="sm">Repair Request/Status</Heading>
          <SimpleGrid columns={2} spacing={2}>
            <Text><b>Requested By:</b></Text> <Text>{repair[1]}</Text>
            <Text><b>Contractor:</b></Text> <Text>{repair[2]}</Text>
            <Text><b>Amount (wei):</b></Text> <Text>{repair[3].toString()}</Text>
            <Text><b>Pre-Test Hash:</b></Text> <Text>{repair[4]}</Text>
            <Text><b>Repair Hash:</b></Text> <Text>{repair[5]}</Text>
            <Text><b>Post-Test Hash:</b></Text> <Text>{repair[6]}</Text>
            <Text><b>Complete:</b></Text> <Text>{repair[7] ? "Yes" : "No"}</Text>
            <Text><b>Paid:</b></Text> <Text>{repair[8] ? "Yes" : "No"}</Text>
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};

export default ValveHistoryPanel;
