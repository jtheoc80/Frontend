import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { FaTools, FaHistory, FaWallet, FaTable } from "react-icons/fa";
import system from "./theme";

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const bg = "white";

  return (
    <ChakraProvider value={system}>
      <Box minH="100vh" bg="gray.50">
        {/* Header */}
        <Flex as="header" bg="purple.700" p={4} align="center" color="white">
          <Heading fontSize="2xl" fontWeight="bold">
            ValveChain Dashboard
          </Heading>
          <Spacer />
          <HStack gap={4}>
            <Button
              colorScheme={activeTab === 1 ? "purple" : "gray"}
              variant={activeTab === 1 ? "solid" : "outline"}
              onClick={() => setActiveTab(1)}
            >
              <FaTable style={{ marginRight: '8px' }} />
              Valve Inventory
            </Button>
            <Button
              colorScheme={activeTab === 2 ? "purple" : "gray"}
              variant={activeTab === 2 ? "solid" : "outline"}
              onClick={() => setActiveTab(2)}
            >
              <FaTools style={{ marginRight: '8px' }} />
              Repairs
            </Button>
            <Button
              colorScheme={activeTab === 3 ? "purple" : "gray"}
              variant={activeTab === 3 ? "solid" : "outline"}
              onClick={() => setActiveTab(3)}
            >
              <FaHistory style={{ marginRight: '8px' }} />
              Valve History
            </Button>
            <Button
              colorScheme={activeTab === 4 ? "purple" : "gray"}
              variant={activeTab === 4 ? "solid" : "outline"}
              onClick={() => setActiveTab(4)}
            >
              <FaWallet style={{ marginRight: '8px' }} />
              Payments
            </Button>
          </HStack>
        </Flex>

        {/* Main Content */}
        <Box>
          {activeTab === 0 && (
            <Box maxW="7xl" mx="auto" p={6}>
              {/* Welcome and Stats */}
              <Flex align="center" justify="space-between" mb={8}>
                <Box>
                  <Heading fontSize="lg">Welcome, Jimmy!</Heading>
                  <Text color="gray.500">Your role: Admin</Text>
                </Box>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <StatCard label="Valves" value="250" />
                  <StatCard label="In Repair" value="3" />
                  <StatCard label="Owed" value="$12,500" />
                </SimpleGrid>
              </Flex>
              {/* System Status */}
              <Box bg={bg} rounded="2xl" shadow="md" p={6}>
                <Heading fontSize="lg" mb={4}>
                  System Status
                </Heading>
                <VStack gap={4} align="start">
                  <Text color="green.500">✅ Frontend: Connected</Text>
                  <Text color="orange.500">⏳ Express API: Running on port 8080</Text>
                  <Text color="orange.500">⏳ FastAPI Service: Running on port 8000</Text>
                </VStack>
              </Box>
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box p={6}>
              <Heading size="md">Valve Inventory</Heading>
              <Text mt={4}>Valve table will be displayed here once components are properly configured.</Text>
            </Box>
          )}
          
          {activeTab === 2 && (
            <Box p={6}>
              <Heading size="md">Repairs Panel</Heading>
              <Text mt={4}>Repairs management functionality coming soon.</Text>
            </Box>
          )}
          
          {activeTab === 3 && (
            <Box p={6}>
              <Heading size="md">Valve History Viewer</Heading>
              <Text mt={4}>Valve history tracking functionality coming soon.</Text>
            </Box>
          )}
          
          {activeTab === 4 && (
            <Box p={6}>
              <Heading size="md">Payments Panel</Heading>
              <Text mt={4}>Payment management functionality coming soon.</Text>
            </Box>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

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

export default App;
