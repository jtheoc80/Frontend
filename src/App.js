import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  HStack,
  Spacer,
  ChakraProvider,
  defaultSystem,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/table";
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
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Serial Number</Th>
                <Th>Type</Th>
                <Th>Manufacturer</Th>
                <Th>Owner</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {valves.map((v, i) => (
                <Tr key={i}>
                  <Td>{v.sn}</Td>
                  <Td>{v.type}</Td>
                  <Td>{v.mfr}</Td>
                  <Td>{v.owner}</Td>
                  <Td>
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
                  </Td>
                  <Td>
                    <Button size="sm" colorScheme="purple" variant="outline" mr={2}>
                      View
                    </Button>
                    <Button size="sm" colorScheme="purple">
                      Repair
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Dashboard />
    </ChakraProvider>
  );
}
