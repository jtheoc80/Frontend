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
import { FaTools, FaHistory, FaWallet, FaTable, FaIndustry } from "react-icons/fa";
import ValveTable from "./components/Valvetable.tsx";
import ManufacturerPanel from "./components/Roles/Manufacturer Panel.tsx";
import system from "./theme.ts";

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const bg = "white";

  return (
    <ChakraProvider value={system}>
      <Box minH="100vh" bg="gray.50">
        {/* Skip Links for Screen Readers */}
        <Box
          as="a"
          href="#main-content"
          position="absolute"
          top="-40px"
          left="0"
          bg="purple.700"
          color="white"
          p={2}
          zIndex="1000"
          _focus={{
            top: "0",
          }}
        >
          Skip to main content
        </Box>

        {/* Header */}
        <Flex 
          as="header" 
          role="banner"
          bg="purple.700" 
          p={4} 
          align="center" 
          color="white"
          direction={{ base: "column", md: "row" }}
          gap={{ base: 3, md: 0 }}
        >
          <Heading as="h1" fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold">
            ValveChain Dashboard
          </Heading>
          <Spacer display={{ base: "none", md: "block" }} />
          {/* Navigation Buttons - Responsive Layout */}
          <Box
            as="nav"
            role="navigation"
            aria-label="Main navigation"
          >
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
                aria-label="View valve inventory table"
                aria-pressed={tabIndex === 1}
              >
                Valve Inventory
              </Button>
              <Button
                leftIcon={<FaIndustry />}
                colorScheme={tabIndex === 2 ? "purple" : "gray"}
                variant={tabIndex === 2 ? "solid" : "outline"}
                onClick={() => setTabIndex(2)}
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "xs", md: "sm" }}
                aria-label="Manufacturer valve tokenization panel"
                aria-pressed={tabIndex === 2}
              >
                Manufacturer
              </Button>
              <Button
                leftIcon={<FaTools />}
                colorScheme={tabIndex === 3 ? "purple" : "gray"}
                variant={tabIndex === 3 ? "solid" : "outline"}
                onClick={() => setTabIndex(3)}
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "xs", md: "sm" }}
                aria-label="View repairs management panel"
                aria-pressed={tabIndex === 3}
              >
                Repairs
              </Button>
              <Button
                leftIcon={<FaHistory />}
                colorScheme={tabIndex === 4 ? "purple" : "gray"}
                variant={tabIndex === 4 ? "solid" : "outline"}
                onClick={() => setTabIndex(4)}
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "xs", md: "sm" }}
                aria-label="View valve history records"
                aria-pressed={tabIndex === 4}
              >
                Valve History
              </Button>
              <Button
                leftIcon={<FaWallet />}
                colorScheme={tabIndex === 5 ? "purple" : "gray"}
                variant={tabIndex === 5 ? "solid" : "outline"}
                onClick={() => setTabIndex(5)}
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "xs", md: "sm" }}
                aria-label="View payments and billing information"
                aria-pressed={tabIndex === 5}
              >
                Payments
              </Button>
            </HStack>
          </Box>
        </Flex>

        {/* Main Content */}
        <Box as="main" id="main-content" role="main">
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
                    <Heading as="h2" fontSize="lg">Welcome, Jimmy!</Heading>
                    <Text color="gray.500">Your role: Admin</Text>
                  </Box>
                  <SimpleGrid 
                    columns={{ base: 1, sm: 3 }} 
                    spacing={4}
                    w={{ base: "100%", lg: "auto" }}
                    role="region"
                    aria-label="Dashboard statistics"
                  >
                    <StatCard label="Valves" value="250" />
                    <StatCard label="In Repair" value="3" />
                    <StatCard label="Owed" value="$12,500" />
                  </SimpleGrid>
                </Flex>
                {/* Add a quick summary from Valve Table */}
                <Box bg={bg} rounded="2xl" shadow="md" p={{ base: 4, md: 6 }}>
                  <Heading as="h3" fontSize="lg" mb={4}>
                    Quick Valve Summary
                  </Heading>
                  <Text>3 valves due for service, 1 overdue.</Text>
                  {/* You could add a small preview table or chart here if desired */}
                </Box>
              </Box>
            </TabsContent>
              {/* Valve Inventory Tab */}
              <TabsContent value="1">
                <ValveTable />
              </TabsContent>
              {/* Manufacturer Tab */}
              <TabsContent value="2">
                <ManufacturerPanel />
              </TabsContent>
              {/* Repairs Tab */}
              <TabsContent value="3">
                <Box p={6}>
                  <Heading as="h2" size="md">Repairs Panel (Coming Soon)</Heading>
                </Box>
              </TabsContent>
              {/* Valve History Tab */}
              <TabsContent value="4">
                <Box p={6}>
                  <Heading as="h2" size="md">Valve History Viewer (Coming Soon)</Heading>
                </Box>
              </TabsContent>
              {/* Payments Tab */}
              <TabsContent value="5">
                <Box p={6}>
                  <Heading as="h2" size="md">Payments Panel (Coming Soon)</Heading>
                </Box>
              </TabsContent>
          </TabsRoot>
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
      role="region"
      aria-label={`${label}: ${value}`}
    >
      <Text fontSize="2xl" fontWeight="bold" aria-hidden="true">
        {value}
      </Text>
      <Text fontSize="sm" aria-hidden="true">{label}</Text>
    </Box>
  );
}

export default App;
