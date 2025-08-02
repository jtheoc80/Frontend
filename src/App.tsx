import React, { useState } from "react";
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
  TabsContent,
  TabsRoot,
} from "@chakra-ui/react";
import { FaTools, FaHistory, FaWallet, FaTable } from "react-icons/fa";
import ValveTable from "./components/Valvetable";
import { ValveProvider } from "./contexts/ValveContext";
import system from "./theme.ts";

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const bg = "white";

  return (
    <ChakraProvider value={system}>
      <ValveProvider>
        <Box minH="100vh" bg="gray.50">
          {/* Header */}
        <Flex 
          as="header" 
          bg="purple.700" 
          p={4} 
          align="center" 
          color="white"
          direction={{ base: "column", md: "row" }}
          gap={{ base: 3, md: 0 }}
        >
          <Heading fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold">
            ValveChain Dashboard
          </Heading>
          <Spacer display={{ base: "none", md: "block" }} />
          {/* Navigation Buttons - Responsive Layout */}
          <HStack 
            spacing={{ base: 2, md: 4 }} 
            flexWrap={{ base: "wrap", md: "nowrap" }}
            justify={{ base: "center", md: "flex-end" }}
            w={{ base: "100%", md: "auto" }}
          >
            <Button
              leftIcon={<FaTable />}
              colorScheme={tabIndex === 1 ? "purple" : "gray"}
              variant={tabIndex === 1 ? "solid" : "outline"}
              onClick={() => setTabIndex(1)}
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "xs", md: "sm" }}
            >
              Valve Inventory
            </Button>
            <Button
              leftIcon={<FaTools />}
              colorScheme={tabIndex === 2 ? "purple" : "gray"}
              variant={tabIndex === 2 ? "solid" : "outline"}
              onClick={() => setTabIndex(2)}
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "xs", md: "sm" }}
            >
              Repairs
            </Button>
            <Button
              leftIcon={<FaHistory />}
              colorScheme={tabIndex === 3 ? "purple" : "gray"}
              variant={tabIndex === 3 ? "solid" : "outline"}
              onClick={() => setTabIndex(3)}
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "xs", md: "sm" }}
            >
              Valve History
            </Button>
            <Button
              leftIcon={<FaWallet />}
              colorScheme={tabIndex === 4 ? "purple" : "gray"}
              variant={tabIndex === 4 ? "solid" : "outline"}
              onClick={() => setTabIndex(4)}
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "xs", md: "sm" }}
            >
              Payments
            </Button>
          </HStack>
        </Flex>

        {/* Main Tabs */}
        <TabsRoot value={tabIndex.toString()} onValueChange={(value) => setTabIndex(parseInt(value.value))}>
          <TabsContent value="0">
            <Box maxW="7xl" mx="auto" p={{ base: 4, md: 6 }}>
              {/* Welcome and Stats */}
              <Flex 
                align="center" 
                justify="space-between" 
                mb={8}
                direction={{ base: "column", lg: "row" }}
                gap={{ base: 4, lg: 0 }}
              >
                <Box textAlign={{ base: "center", lg: "left" }}>
                  <Heading fontSize="lg">Welcome, Jimmy!</Heading>
                  <Text color="gray.500">Your role: Admin</Text>
                </Box>
                <SimpleGrid 
                  columns={{ base: 1, sm: 3 }} 
                  spacing={4}
                  w={{ base: "100%", lg: "auto" }}
                >
                  <StatCard label="Valves" value="250" />
                  <StatCard label="In Repair" value="3" />
                  <StatCard label="Owed" value="$12,500" />
                </SimpleGrid>
              </Flex>
              {/* Add a quick summary from Valve Table */}
              <Box bg={bg} rounded="2xl" shadow="md" p={{ base: 4, md: 6 }}>
                <Heading fontSize="lg" mb={4}>
                  Quick Valve Summary
                </Heading>
                <Text>Valve data now fetched from API service with React Context management.</Text>
              </Box>
            </Box>
          </TabsContent>
            {/* Valve Inventory Tab */}
            <TabsContent value="1">
              <ValveTable />
            </TabsContent>
            {/* Repairs Tab */}
            <TabsContent value="2">
              <Box p={6}>
                <Heading size="md">Repairs Panel (Coming Soon)</Heading>
              </Box>
            </TabsContent>
            {/* Valve History Tab */}
            <TabsContent value="3">
              <Box p={6}>
                <Heading size="md">Valve History Viewer (Coming Soon)</Heading>
              </Box>
            </TabsContent>
            {/* Payments Tab */}
            <TabsContent value="4">
              <Box p={6}>
                <Heading size="md">Payments Panel (Coming Soon)</Heading>
              </Box>
            </TabsContent>
        </TabsRoot>
      </Box>
      </ValveProvider>
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