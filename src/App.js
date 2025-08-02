import React from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { FaTools, FaHistory, FaWallet } from "react-icons/fa";

const valves = [
  { sn: "2319ABCD", type: "PSV", mfr: "Emerson", owner: "Lyondell", status: "In Service" },
  { sn: "1837XYZ", type: "Ball", mfr: "Cameron", owner: "Dow", status: "In Repair" },
];

function StatCard({ label, value }) {
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

function Dashboard() {
  // hard-coded light theme colors
  const pageBg = "gray.50";
  const cardBg = "white";

  return (
    <Box minH="100vh" bg={pageBg}>
      <Flex as="header" bg="purple.700" p={4} align="center" color="white">
        <Heading fontSize="2xl" fontWeight="bold">
          ValveChain Dashboard
        </Heading>
        <Spacer />
        <HStack spacing={4}>
          <Button leftIcon={<FaTools />} colorScheme="purple" variant="outline">
            Repairs
          </Button>
          <Button leftIcon={<FaHistory />} colorScheme="purple" variant="outline">
            Valve History
          </Button>
          <Button leftIcon={<FaWallet />} colorScheme="purple" variant="outline">
            Payments
          </Button>
        </HStack>
      </Flex>

      <Box maxW="7xl" mx="auto" p={6}>
        <Flex align="center" justify="space-between" mb={8}>
          <Box>
            <Heading fontSize="lg">Welcome, Jimmy!</Heading>
            <Text color="gray.500">Your role: Admin</Text>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <StatCard label="Valves" value="250" />
            <StatCard label="In Repair" value="3" />
            <StatCard label="Owed" value="$12,500" />
          </SimpleGrid>
        </Flex>

        <Box bg={cardBg} rounded="2xl" shadow="md" p={6}>
          <Heading fontSize="lg" mb={4}>
            Valve Inventory
          </Heading>
          <Box overflowX="auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f7fafc" }}>
                  <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Serial Number</th>
                  <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Type</th>
                  <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Manufacturer</th>
                  <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Owner</th>
                  <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {valves.map((v, i) => (
                  <tr key={i}>
                    <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{v.sn}</td>
                    <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{v.type}</td>
                    <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{v.mfr}</td>
                    <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{v.owner}</td>
                    <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>
                      <Box
                        px={2}
                        py={1}
                        bg={v.status === "In Repair" ? "orange.200" : "green.200"}
                        color="black"
                        rounded="md"
                        display="inline-block"
                        fontSize="sm"
                      >
                        {v.status}
                      </Box>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>
                      <Button size="sm" colorScheme="purple" variant="outline" mr={2}>
                        View
                      </Button>
                      <Button size="sm" colorScheme="purple">
                        Repair
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ChakraProvider>
      <Dashboard />
    </ChakraProvider>
  );
}
