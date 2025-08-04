import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Container,
} from "@chakra-ui/react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onLearnMore: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onLogin, onLearnMore }) => {
  return (
    <Box 
      bg="linear-gradient(135deg, #1e3a8a 0%, #4c32b3 100%)" 
      color="white" 
      py={{ base: 16, md: 24 }}
      role="banner"
    >
      <Container maxW="1200px" px={{ base: 4, md: 8 }}>
        <VStack spacing={8} textAlign="center">
          {/* Logo and Brand */}
          <VStack spacing={4}>
            <Box 
              as="img" 
              src="/src/assets/logo.svg" 
              alt="ValveChain - Industrial valve management on blockchain"
              h="60px"
              w="auto"
            />
            <Heading 
              as="h1" 
              size={{ base: "2xl", md: "4xl" }} 
              fontWeight="800"
              letterSpacing="-0.02em"
              lineHeight="1.1"
            >
              Industrial Valve Management
              <Text as="span" display="block" color="#6ee7b7" mt={2}>
                Powered by Blockchain
              </Text>
            </Heading>
          </VStack>

          {/* Value Proposition */}
          <Text 
            fontSize={{ base: "lg", md: "xl" }} 
            maxW="600px" 
            color="#f1f5f9"
            lineHeight="1.6"
          >
            Secure, transparent, and efficient valve lifecycle management for industrial facilities. 
            Track manufacturing, maintenance, and compliance with immutable blockchain records.
          </Text>

          {/* Call-to-Action Buttons */}
          <HStack spacing={4} flexWrap="wrap" justify="center">
            <Button
              size="lg"
              bg="#10b981"
              color="white"
              _hover={{ bg: "#059669", transform: "translateY(-2px)" }}
              _active={{ bg: "#047857" }}
              px={8}
              py={6}
              fontSize="md"
              fontWeight="600"
              borderRadius="lg"
              transition="all 0.2s"
              onClick={onGetStarted}
              aria-label="Start registration process"
            >
              Get Started
            </Button>
            <Button
              size="lg"  
              variant="outline"
              borderColor="white"
              color="white"
              _hover={{ bg: "whiteAlpha.100", transform: "translateY(-2px)" }}
              _active={{ bg: "whiteAlpha.200" }}
              px={8}
              py={6}
              fontSize="md"
              fontWeight="600"
              borderRadius="lg"
              transition="all 0.2s"
              onClick={onLogin}
              aria-label="Sign in to existing account"
            >
              Sign In
            </Button>
            <Button
              size="lg"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.100" }}
              _active={{ bg: "whiteAlpha.200" }}
              px={8}
              py={6}
              fontSize="md"
              fontWeight="600"
              borderRadius="lg"
              onClick={onLearnMore}
              aria-label="Learn more about ValveChain"
            >
              Learn More
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default HeroSection;