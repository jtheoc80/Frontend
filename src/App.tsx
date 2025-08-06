import React, { useEffect } from "react";
import { Container, Text, ChakraProvider, defaultSystem } from "@chakra-ui/react";

import { LocaleProvider } from "./contexts/LocaleContext.tsx";
import { LocaleSettings } from "./components/LocaleSettings.tsx";

import { useTranslation } from "react-i18next";
import { getTextDirection } from "./i18n.ts";
// import ErrorBoundary from "./components/ErrorBoundary";
// import HealthCheck from "./components/HealthCheck";

import SimpleLandingPage from "./components/Landing/SimpleLandingPage.tsx";
// import SimpleRegistration from "./components/Registration/SimpleRegistration.tsx";
// import SimpleGettingStarted from "./components/GettingStarted/SimpleGettingStarted.tsx";
// import SimpleManufacturerDashboard from "./components/Dashboard/SimpleManufacturerDashboard.tsx";
// import SimpleDistributorDashboard from "./components/Dashboard/SimpleDistributorDashboard.tsx";
// ...keep your other imports below

function App() {
  const { i18n } = useTranslation();

  // Keep document direction in sync with the current language (e.g., "rtl" for Arabic/Hebrew)
  useEffect(() => {
    document.dir = getTextDirection(i18n.language);
  }, [i18n.language]);

  return (
    <ChakraProvider value={defaultSystem}>
      <LocaleProvider>
        <Container maxW="container.lg" py={6}>
          <LocaleSettings>
            <Text fontSize="lg" mb={4}>
              Welcome
            </Text>

            {/* Example usage – replace with your router or actual pages */}
            <SimpleLandingPage 
              onGetStarted={() => console.log('Get started clicked')}
              onLogin={() => console.log('Login clicked')}
              onLearnMore={() => console.log('Learn more clicked')}
            />
            {/* <ErrorBoundary><HealthCheck /></ErrorBoundary> */}
          </LocaleSettings>
        </Container>
      </LocaleProvider>
    </ChakraProvider>
  );
}

export default App;