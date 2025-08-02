import React, { useState, Suspense } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  HStack,
  Spacer,
  Tabs,
  TabPanels,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import { FaTools, FaHistory, FaWallet, FaTable } from "react-icons/fa";
import LoadingPanel from "./components/LoadingPanel.tsx";

// Lazy load tab panel components
const DashboardPanel = React.lazy(() => import("./components/DashboardPanel.tsx"));
const ValveTable = React.lazy(() => import("./components/Valvetable.tsx"));
const RepairsPanel = React.lazy(() => import("./components/RepairsPanel.tsx"));
const ValveHistoryViewerPanel = React.lazy(() => import("./components/ValveHistoryViewerPanel.tsx"));
const PaymentsPanel = React.lazy(() => import("./components/PaymentsPanel.tsx"));

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <ChakraProvider>
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
              <Suspense fallback={<LoadingPanel />}>
                <DashboardPanel />
              </Suspense>
            </TabPanel>
            {/* Valve Inventory Tab */}
            <TabPanel>
              <Suspense fallback={<LoadingPanel />}>
                <ValveTable />
              </Suspense>
            </TabPanel>
            {/* Repairs Tab */}
            <TabPanel>
              <Suspense fallback={<LoadingPanel />}>
                <RepairsPanel />
              </Suspense>
            </TabPanel>
            {/* Valve History Tab */}
            <TabPanel>
              <Suspense fallback={<LoadingPanel />}>
                <ValveHistoryViewerPanel />
              </Suspense>
            </TabPanel>
            {/* Payments Tab */}
            <TabPanel>
              <Suspense fallback={<LoadingPanel />}>
                <PaymentsPanel />
              </Suspense>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default App;
