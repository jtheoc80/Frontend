import React from "react";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Box
      bg="purple.50"
      color="purple.900"
      rounded="2xl"
      px={6}
      py={4}
      shadow="sm"
      textAlign="center"
      minW="110px"
    >
      <Text fontSize="2xl" fontWeight="bold">
        {value}
      </Text>
      <Text fontSize="sm">{label}</Text>
    </Box>
  );
}

const DashboardPanel: React.FC = () => {
  const bg = "white";
  
  return (
    <Box maxW="7xl" mx="auto" p={6}>
      {/* Welcome and Stats */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <Box>
          <Heading fontSize="lg">Welcome, Jimmy!</Heading>
          <Text color="gray.500">Your role: Admin</Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <StatCard label="Valves" value="250" />
          <StatCard label="In Repair" value="3" />
          <StatCard label="Owed" value="$12,500" />
        </SimpleGrid>
      </div>
      {/* Add a quick summary from Valve Table */}
      <Box bg={bg} rounded="2xl" shadow="md" p={6}>
        <Heading fontSize="lg" mb={4}>
          Quick Valve Summary
        </Heading>
        <Text>3 valves due for service, 1 overdue.</Text>
        {/* You could add a small preview table or chart here if desired */}
      </Box>
    </Box>
  );
};

export default DashboardPanel;