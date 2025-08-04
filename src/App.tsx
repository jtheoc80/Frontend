import React, { useState } from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import {
  Box,
  Button,
  HStack,
  Heading,
  Container,
} from "@chakra-ui/react";
import SimpleLandingPage from "./components/Landing/SimpleLandingPage.tsx";
import SimpleRegistration from "./components/Registration/SimpleRegistration.tsx";
import SimpleGettingStarted from "./components/GettingStarted/SimpleGettingStarted.tsx";
import ManufacturerPanel from "./components/Roles/Manufacturer Panel.tsx";

type AppView = 'landing' | 'registration' | 'gettingStarted' | 'dashboard';
type DashboardTab = 'manufacturer' | 'inventory' | 'repairs' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentTab, setCurrentTab] = useState<DashboardTab>('manufacturer');

  const handleGetStarted = () => {
    setCurrentView('registration');
  };

  const handleLogin = () => {
    // For demo purposes, go directly to dashboard
    setCurrentView('dashboard');
  };

  const handleLearnMore = () => {
    // Could scroll to features section or open modal
    console.log('Learn more clicked');
  };

  const handleRegistrationComplete = (formData: any) => {
    console.log('Registration completed:', formData);
    setCurrentView('gettingStarted');
  };

  const handleRegistrationCancel = () => {
    setCurrentView('landing');
  };

  const handleGettingStartedComplete = () => {
    setCurrentView('dashboard');
  };

  const renderDashboard = () => {
    const dashboardStyles = {
      container: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      },
      header: {
        backgroundColor: '#1e3a8a',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap' as const
      },
      nav: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap' as const
      },
      navButton: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.3)',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s'
      },
      activeNavButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        border: '1px solid white'
      }
    };

    return (
      <div style={dashboardStyles.container}>
        {/* Header */}
        <header style={dashboardStyles.header}>
          <HStack spacing={4}>
            <Heading size="lg" fontWeight="bold" color="white">
              ValveChain Dashboard
            </Heading>
          </HStack>
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => setCurrentView('gettingStarted')}
            >
              Getting Started
            </Button>
            <nav style={dashboardStyles.nav}>
              <button 
                style={{
                  ...dashboardStyles.navButton,
                  ...(currentTab === 'inventory' ? dashboardStyles.activeNavButton : {})
                }}
                onClick={() => setCurrentTab('inventory')}
              >
                Valve Inventory
              </button>
              <button 
                style={{
                  ...dashboardStyles.navButton,
                  ...(currentTab === 'manufacturer' ? dashboardStyles.activeNavButton : {})
                }}
                onClick={() => setCurrentTab('manufacturer')}
              >
                Manufacturer
              </button>
              <button 
                style={{
                  ...dashboardStyles.navButton,
                  ...(currentTab === 'repairs' ? dashboardStyles.activeNavButton : {})
                }}
                onClick={() => setCurrentTab('repairs')}
              >
                Repairs
              </button>
              <button 
                style={{
                  ...dashboardStyles.navButton,
                  ...(currentTab === 'history' ? dashboardStyles.activeNavButton : {})
                }}
                onClick={() => setCurrentTab('history')}
              >
                History
              </button>
            </nav>
          </HStack>
        </header>

        {/* Main Content */}
        <main>
          {currentTab === 'manufacturer' && <ManufacturerPanel />}
          {currentTab === 'inventory' && (
            <Container maxW="1200px" py={8}>
              <Box textAlign="center" py={16}>
                <Heading size="xl" color="#1e3a8a" mb={4}>
                  Valve Inventory
                </Heading>
                <Box color="#64748b">
                  This would show the valve inventory table (see existing ValveTable component)
                </Box>
              </Box>
            </Container>
          )}
          {currentTab === 'repairs' && (
            <Container maxW="1200px" py={8}>
              <Box textAlign="center" py={16}>
                <Heading size="xl" color="#1e3a8a" mb={4}>
                  Repairs Panel
                </Heading>
                <Box color="#64748b">
                  Coming Soon - Repair management functionality
                </Box>
              </Box>
            </Container>
          )}
          {currentTab === 'history' && (
            <Container maxW="1200px" py={8}>
              <Box textAlign="center" py={16}>
                <Heading size="xl" color="#1e3a8a" mb={4}>
                  Valve History
                </Heading>
                <Box color="#64748b">
                  Coming Soon - Valve history tracking
                </Box>
              </Box>
            </Container>
          )}
        </main>
      </div>
    );
  };

  return (
    <ChakraProvider value={defaultSystem}>
      {currentView === 'landing' && (
        <SimpleLandingPage 
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
          onLearnMore={handleLearnMore}
        />
      )}
      {currentView === 'registration' && (
        <SimpleRegistration 
          onComplete={handleRegistrationComplete}
          onCancel={handleRegistrationCancel}
        />
      )}
      {currentView === 'gettingStarted' && (
        <SimpleGettingStarted 
          onClose={handleGettingStartedComplete}
        />
      )}
      {currentView === 'dashboard' && renderDashboard()}
    </ChakraProvider>
  );
}

export default App;