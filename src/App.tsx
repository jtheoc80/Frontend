import React, { useState } from "react";
import {
  ChakraProvider,
  defaultSystem,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Spacer,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { FaTools, FaHistory, FaWallet, FaTable } from "react-icons/fa";
import ValveTable from "./components/Valvetable";

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const bg = "white";

  return (
    <ChakraProvider value={defaultSystem}>
      <Box minH="100vh" bg="gray.50">
        {/* Header */}
        <Flex as="header" bg="purple.700" p={4} align="center" color="white">
          <Heading fontSize="2xl" fontWeight="bold">
            ValveChain Dashboard
          </Heading>
          <Spacer />
          <HStack spacing={4}>
            <Button
              leftIcon={<FaTable />}
              colorScheme={tabIndex === 1 ? "purple" : "gray"}
              variant={tabIndex === 1 ? "solid" : "outline"}
              onClick={() => setTabIndex(1)}
            >
              Valve Inventory
            </Button>
            <Button
              leftIcon={<FaTools />}
              colorScheme={tabIndex === 2 ? "purple" : "gray"}
              variant={tabIndex === 2 ? "solid" : "outline"}
              onClick={() => setTabIndex(2)}
            >
              Repairs
            </Button>
            <Button
              leftIcon={<FaHistory />}
              colorScheme={tabIndex === 3 ? "purple" : "gray"}
              variant={tabIndex === 3 ? "solid" : "outline"}
              onClick={() => setTabIndex(3)}
            >
              Valve History
            </Button>
            <Button
              leftIcon={<FaWallet />}
              colorScheme={tabIndex === 4 ? "purple" : "gray"}
              variant={tabIndex === 4 ? "solid" : "outline"}
              onClick={() => setTabIndex(4)}
            >
              Payments
            </Button>
          </HStack>
        </Flex>

        {/* Main Tabs */}
        <Tabs index={tabIndex} onChange={setTabIndex} mt={0} variant="unstyled">
          <TabPanels>
            {/* Dashboard */}
            <TabPanel>
              <Box maxW="7xl" mx="auto" p={6}>
                {/* Welcome and Stats */}
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
                {/* Add a quick summary from Valve Table */}
                <Box bg={bg} rounded="2xl" shadow="md" p={6}>
                  <Heading fontSize="lg" mb={4}>
                    Quick Valve Summary
                  </Heading>
                  <Text>3 valves due for service, 1 overdue.</Text>
                  {/* You could add a small preview table or chart here if desired */}
                </Box>
              </Box>
            </TabPanel>
            {/* Valve Inventory Tab */}
            <TabPanel>
              <ValveTable />
            </TabPanel>
            {/* Repairs Tab */}
            <TabPanel>
              <Box p={6}>
                <Heading size="md">Repairs Panel (Coming Soon)</Heading>
              </Box>
            </TabPanel>
            {/* Valve History Tab */}
            <TabPanel>
              <Box p={6}>
                <Heading size="md">Valve History Viewer (Coming Soon)</Heading>
              </Box>
            </TabPanel>
            {/* Payments Tab */}
            <TabPanel>
              <Box p={6}>
                <Heading size="md">Payments Panel (Coming Soon)</Heading>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
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
