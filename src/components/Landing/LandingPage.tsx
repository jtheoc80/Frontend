import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Button,
  Badge,
} from "@chakra-ui/react";
import HeroSection from "./HeroSection.tsx";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onLearnMore: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onLearnMore }) => {
  const features = [
    {
      title: "Secure Manufacturing Records",
      description: "Immutable manufacturing data and quality certifications stored on blockchain",
      icon: "🏭",
      iconAlt: "Manufacturing",
    },
    {
      title: "Maintenance Tracking",
      description: "Complete maintenance history with vendor records and compliance documentation",
      icon: "🔧",
      iconAlt: "Maintenance",
    },
    {
      title: "Compliance Management",
      description: "Automated compliance monitoring and reporting for industrial standards",
      icon: "📋",
      iconAlt: "Compliance",
    },
    {
      title: "Supply Chain Transparency",
      description: "Full traceability from manufacturing through installation and maintenance",
      icon: "🔗",
      iconAlt: "Supply Chain",
    },
  ];

  const benefits = [
    {
      title: "For Manufacturers",
      description: "Protect your brand with verified quality records and warranty management",
      color: "copper.500",
    },
    {
      title: "For Plant Operators",
      description: "Ensure compliance and optimize maintenance schedules with complete valve history",
      color: "deepBlue.500",
    },
    {
      title: "For Repair Vendors", 
      description: "Build trust with transparent service records and certified repair documentation",
      color: "emeraldGreen.500",
    },
  ];

  return (
    <Box bg="silverGray.50" minH="100vh">
      {/* Navigation Header */}
      <Box bg="white" borderBottom="1px" borderColor="silverGray.200" py={4}>
        <Container maxW="1200px" px={{ base: 4, md: 8 }}>
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Box 
                as="img" 
                src="/src/assets/logo.svg" 
                alt="ValveChain"
                h="32px"
                w="auto"
              />
            </HStack>
            <HStack spacing={4}>
              <Button
                variant="ghost"
                color="deepBlue.700"
                _hover={{ bg: "deepBlue.50" }}
                size="sm"
                onClick={onLearnMore}
                aria-label="Learn more about ValveChain"
              >
                About
              </Button>
              <Button
                variant="outline"
                colorScheme="deepBlue"
                size="sm"
                onClick={onLogin}
                aria-label="Sign in to account"
              >
                Sign In
              </Button>
              <Button
                bg="emeraldGreen.500"
                color="white"
                _hover={{ bg: "emeraldGreen.600" }}
                size="sm"
                onClick={onGetStarted}
                aria-label="Get started with ValveChain"
              >
                Get Started
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Hero Section */}
      <HeroSection 
        onGetStarted={onGetStarted}
        onLogin={onLogin}
        onLearnMore={onLearnMore}
      />

      {/* Features Section */}
      <Box py={20} bg="white">
        <Container maxW="1200px" px={{ base: 4, md: 8 }}>
          <VStack spacing={12} textAlign="center">
            <VStack spacing={4}>
              <Heading 
                as="h2" 
                size="2xl" 
                color="deepBlue.900"
                fontWeight="700"
              >
                Industrial-Grade Valve Management
              </Heading>
              <Text 
                fontSize="lg" 
                color="silverGray.600" 
                maxW="600px"
              >
                Built for the demands of modern industrial facilities with enterprise-level security and compliance features.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  borderRadius="xl"
                  border="1px"
                  borderColor="silverGray.200"
                  _hover={{ 
                    shadow: "lg", 
                    transform: "translateY(-4px)",
                    borderColor: "emeraldGreen.200"
                  }}
                  transition="all 0.3s"
                >
                  <CardBody p={6}>
                    <VStack spacing={4} textAlign="center">
                      <Box
                        w="50px"
                        h="50px"
                        bg="emeraldGreen.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="24px"
                        aria-label={feature.iconAlt}
                      >
                        <Text fontSize="20px" fontWeight="600" color="emeraldGreen.700">
                          {feature.iconAlt.charAt(0)}
                        </Text>
                      </Box>
                      <Heading size="md" color="deepBlue.800">
                        {feature.title}
                      </Heading>
                      <Text color="silverGray.600" fontSize="sm" lineHeight="1.6">
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box py={20} bg="silverGray.50">
        <Container maxW="1200px" px={{ base: 4, md: 8 }}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading 
                as="h2" 
                size="2xl" 
                color="deepBlue.900"
                fontWeight="700"
              >
                Built for Every Stakeholder
              </Heading>
              <Text 
                fontSize="lg" 
                color="silverGray.600" 
                maxW="600px"
              >
                ValveChain serves the entire industrial valve ecosystem with role-specific features and workflows.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} w="full">
              {benefits.map((benefit, index) => (
                <Card 
                  key={index}
                  bg="white"
                  borderRadius="xl"
                  border="1px"
                  borderColor="silverGray.200"
                  _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                  transition="all 0.3s"
                >
                  <CardBody p={8}>
                    <VStack spacing={4} align="start">
                      <Badge 
                        colorScheme="emeraldGreen" 
                        px={3} 
                        py={1} 
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="600"
                      >
                        {benefit.title}
                      </Badge>
                      <Text color="silverGray.700" lineHeight="1.6">
                        {benefit.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Footer CTA */}
      <Box py={16} bg="deepBlue.900" color="white">
        <Container maxW="1200px" px={{ base: 4, md: 8 }}>
          <VStack spacing={8} textAlign="center">
            <Heading size="xl" fontWeight="700">
              Ready to Transform Your Valve Management?
            </Heading>
            <Text fontSize="lg" color="silverGray.200" maxW="500px">
              Join leading industrial facilities already using ValveChain for secure, compliant operations.
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                bg="emeraldGreen.500"
                color="white"
                _hover={{ bg: "emeraldGreen.600" }}
                px={8}
                py={6}
                onClick={onGetStarted}
                aria-label="Start using ValveChain"
              >
                Get Started Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: "whiteAlpha.100" }}
                px={8}
                py={6}
                onClick={onLearnMore}
                aria-label="Contact sales team"
              >
                Contact Sales
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;