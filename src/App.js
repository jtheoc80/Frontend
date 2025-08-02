// src/App.js
import React from "react";
import {
  ChakraProvider,
  defaultSystem,
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
          <Table.Root variant="simple">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Serial Number</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader>Manufacturer</Table.ColumnHeader>
                <Table.ColumnHeader>Owner</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {valves.map((v, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{v.sn}</Table.Cell>
                  <Table.Cell>{v.type}</Table.Cell>
                  <Table.Cell>{v.mfr}</Table.Cell>
                  <Table.Cell>{v.owner}</Table.Cell>
                  <Table.Cell>
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
                  </Table.Cell>
                  <Table.Cell>
                    <Button size="sm" colorScheme="purple" variant="outline" mr={2}>
                      View
                    </Button>
                    <Button size="sm" colorScheme="purple">
                      Repair
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
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
