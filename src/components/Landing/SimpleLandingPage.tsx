import React from "react";
import { Box, Button, Heading, Text, VStack, HStack, Container } from "@chakra-ui/react";

interface SimpleLandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onLearnMore: () => void;
}

const SimpleLandingPage: React.FC<SimpleLandingPageProps> = ({ onGetStarted, onLogin, onLearnMore }) => {
  return (
    <Box bg="#f8fafc" minH="100vh">
      {/* Navigation Header */}
      <Box bg="white" borderBottom="1px solid #e2e8f0" py={4}>
        <Container maxW="1200px" px={{ base: 4, md: 8 }}>
          <HStack justify="space-between" align="center">
            <Heading size="md" color="#1e3a8a">
              ValveChain
            </Heading>
            <HStack spacing={4}>
              <Button
                variant="ghost"
                color="#1e3a8a"
                size="sm"
                onClick={onLearnMore}
              >
                About
              </Button>
              <Button
                variant="outline"
                colorScheme="blue"
                size="sm"
                onClick={onLogin}
              >
                Sign In
              </Button>
              <Button
                bg="#10b981"
                color="white"
                _hover={{ bg: "#059669" }}
                size="sm"
                onClick={onGetStarted}
              >
                Get Started
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box bg="linear-gradient(135deg, #1e3a8a 0%, #4c32b3 100%)" color="white" py={20}>
        <Container maxW="1200px" px={{ base: 4, md: 8 }}>
          <VStack spacing={8} textAlign="center">
            <VStack spacing={4}>
              <Heading 
                as="h1" 
                size="4xl" 
                fontWeight="bold"
                lineHeight="1.1"
              >
                Industrial Valve Management
              </Heading>
              <Text color="#6ee7b7" fontSize="2xl" fontWeight="600">
                Powered by Blockchain
              </Text>
            </VStack>

            <Text 
              fontSize="xl" 
              maxW="600px" 
              color="#f1f5f9"
              lineHeight="1.6"
            >
              Secure, transparent, and efficient valve lifecycle management for industrial facilities. 
              Track manufacturing, maintenance, and compliance with immutable blockchain records.
            </Text>

            <HStack spacing={4}>
              <Button
                size="lg"
                bg="#10b981"
                color="white"
                _hover={{ bg: "#059669" }}
                px={8}
                py={6}
                fontSize="md"
                onClick={onGetStarted}
              >
                Get Started
              </Button>
              <Button
                size="lg"  
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: "whiteAlpha.100" }}
                px={8}
                py={6}
                fontSize="md"
                onClick={onLogin}
              >
                Sign In
              </Button>
              <Button
                size="lg"
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.100" }}
                px={8}
                py={6}
                fontSize="md"
                onClick={onLearnMore}
              >
                Learn More
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg="white">
        <Container maxW="1200px" px={{ base: 4, md: 8 }}>
          <VStack spacing={12} textAlign="center">
            <VStack spacing={4}>
              <Heading 
                as="h2" 
                size="2xl" 
                color="#1e3a8a"
                fontWeight="bold"
              >
                Industrial-Grade Valve Management
              </Heading>
              <Text 
                fontSize="lg" 
                color="#64748b" 
                maxW="600px"
              >
                Built for the demands of modern industrial facilities with enterprise-level security and compliance features.
              </Text>
            </VStack>

            <Box>
              <VStack spacing={8}>
                <Box textAlign="center" p={6} borderRadius="xl" border="1px solid #e2e8f0">
                  <Heading size="md" color="#1e3a8a" mb={3}>
                    Secure Manufacturing Records
                  </Heading>
                  <Text color="#64748b" fontSize="sm">
                    Immutable manufacturing data and quality certifications stored on blockchain
                  </Text>
                </Box>
                
                <Box textAlign="center" p={6} borderRadius="xl" border="1px solid #e2e8f0">
                  <Heading size="md" color="#1e3a8a" mb={3}>
                    Maintenance Tracking
                  </Heading>
                  <Text color="#64748b" fontSize="sm">
                    Complete maintenance history with vendor records and compliance documentation
                  </Text>
                </Box>
                
                <Box textAlign="center" p={6} borderRadius="xl" border="1px solid #e2e8f0">
                  <Heading size="md" color="#1e3a8a" mb={3}>
                    Supply Chain Transparency
                  </Heading>
                  <Text color="#64748b" fontSize="sm">
                    Full traceability from manufacturing through installation and maintenance
                  </Text>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Footer CTA */}
      <Box py={16} bg="#1e3a8a" color="white">
        <Container maxW="1200px" px={{ base: 4, md: 8 }}>
          <VStack spacing={8} textAlign="center">
            <Heading size="xl" fontWeight="bold">
              Ready to Transform Your Valve Management?
            </Heading>
            <Text fontSize="lg" color="#f1f5f9" maxW="500px">
              Join leading industrial facilities already using ValveChain for secure, compliant operations.
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                bg="#10b981"
                color="white"
                _hover={{ bg: "#059669" }}
                px={8}
                py={6}
                onClick={onGetStarted}
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

export default SimpleLandingPage;