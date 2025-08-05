import React, { useState, useEffect } from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import {
  Box,
  Button,
  HStack,
  Heading,
  Container,
  Text,
} from "@chakra-ui/react";
// @ts-ignore
import { useTranslation } from 'react-i18next';
import { getTextDirection } from './i18n.ts';
import SimpleLandingPage from "./components/Landing/SimpleLandingPage.tsx";
import SimpleRegistration from "./components/Registration/SimpleRegistration.tsx";
import SimpleGettingStarted from "./components/GettingStarted/SimpleGettingStarted.tsx";
import SimpleManufacturerDashboard from "./components/Dashboard/SimpleManufacturerDashboard.tsx";
import SimpleDistributorDashboard from "./components/Dashboard/SimpleDistributorDashboard.tsx";
import SimplePlantDashboard from "./components/Dashboard/SimplePlantDashboard.tsx";
import SimpleRepairDashboard from "./components/Dashboard/SimpleRepairDashboard.tsx";

type AppView = 'landing' | 'registration' | 'gettingStarted' | 'dashboard';
type DashboardTab = 'manufacturer' | 'distributor' | 'plant' | 'repair' | 'inventory' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentTab, setCurrentTab] = useState<DashboardTab>('manufacturer');
  const { t, i18n } = useTranslation();

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = getTextDirection();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Inline LanguageSwitcher component  
  const LanguageSwitcher = () => {
    const languages = [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    ];

    const handleLanguageChange = (languageCode: string) => {
      i18n.changeLanguage(languageCode);
      
      // Update document direction
      document.documentElement.dir = getTextDirection();
      document.documentElement.lang = languageCode;
    };

    return (
      <HStack spacing={2}>
        {languages.map((language) => (
          <Button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            variant={i18n.language === language.code ? "solid" : "ghost"}
            size="sm"
            color="white"
            bg={i18n.language === language.code ? 'whiteAlpha.300' : 'transparent'}
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            <HStack spacing={1}>
              <Text fontSize="sm">{language.flag}</Text>
              <Text fontSize="sm">{language.name}</Text>
            </HStack>
          </Button>
        ))}
      </HStack>
    );
  };

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
              {t('dashboard.title')}
            </Heading>
          </HStack>
          <HStack spacing={2}>
            <LanguageSwitcher />
            <Button
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => setCurrentView('gettingStarted')}
            >
              {t('navigation.gettingStarted')}
            </Button>
            <nav style={dashboardStyles.nav}>
              <button 
                style={{
                  ...dashboardStyles.navButton,
                  ...(currentTab === 'manufacturer' ? dashboardStyles.activeNavButton : {})
                }}
                onClick={() => setCurrentTab('manufacturer')}
              >
                {t('navigation.manufacturer')}
              </button>
              <button 
                style={{
                  ...dashboardStyles.navButton,
                  ...(currentTab === 'distributor' ? dashboardStyles.activeNavButton : {})
                }}
                onClick={() => setCurrentTab('distributor')}
              >
                {t('navigation.distributor')}
              </button>
              <button 
                style={{
                  ...dashboardStyles.navButton,
                  ...(currentTab === 'plant' ? dashboardStyles.activeNavButton : {})
                }}
                onClick={() => setCurrentTab('plant')}
              >
                {t('navigation.plant')}
              </button>
              <button 
                style={{
                  ...dashboardStyles.navButton,
                  ...(currentTab === 'repair' ? dashboardStyles.activeNavButton : {})
                }}
                onClick={() => setCurrentTab('repair')}
              >
                {t('navigation.repair')}
              </button>
              <button 
                style={{
                  ...dashboardStyles.navButton,
                  ...(currentTab === 'inventory' ? dashboardStyles.activeNavButton : {})
                }}
                onClick={() => setCurrentTab('inventory')}
              >
                {t('navigation.valveInventory')}
              </button>
              <button 
                style={{
                  ...dashboardStyles.navButton,
                  ...(currentTab === 'history' ? dashboardStyles.activeNavButton : {})
                }}
                onClick={() => setCurrentTab('history')}
              >
                {t('navigation.history')}
              </button>
            </nav>
          </HStack>
        </header>

        {/* Main Content */}
        <main>
          {currentTab === 'manufacturer' && <SimpleManufacturerDashboard />}
          {currentTab === 'distributor' && <SimpleDistributorDashboard />}
          {currentTab === 'plant' && <SimplePlantDashboard />}
          {currentTab === 'repair' && <SimpleRepairDashboard />}
          {currentTab === 'inventory' && (
            <Container maxW="1200px" py={8}>
              <Box textAlign="center" py={16}>
                <Heading size="xl" color="#1e3a8a" mb={4}>
                  {t('navigation.valveInventory')}
                </Heading>
                <Box color="#64748b">
                  This would show the valve inventory table (see existing ValveTable component)
                </Box>
              </Box>
            </Container>
          )}
          {currentTab === 'history' && (
            <Container maxW="1200px" py={8}>
              <Box textAlign="center" py={16}>
                <Heading size="xl" color="#1e3a8a" mb={4}>
                  {t('navigation.history')}
                </Heading>
                <Box color="#64748b">
                  {t('common.comingSoon')} - Valve history tracking
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