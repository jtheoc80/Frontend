import React from "react";
import { Box, Heading, Text, VStack, Divider } from "@chakra-ui/react";
import ValveHistoryPanel from "./ValveHistoryPanel";

const Dashboard = ({ contractAddress, network }: { contractAddress: string; network: string }) => (
  <Box mb={8} p={5} borderWidth={1} borderRadius="lg" shadow="sm">
    <VStack align="start" spacing={3}>
      <Heading as="h2" size="md" color="teal.700">
        Smart Contract Overview
      </Heading>
      <Text>
        <b>Contract Address:</b>{" "}
        <span style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{contractAddress}</span>
      </Text>
      <Text>
        <b>Network:</b> {network}
      </Text>
      <Divider />
      <ValveHistoryPanel />
    </VStack>
  </Box>
);

export default Dashboard;


