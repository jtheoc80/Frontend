import React, { useState } from "react";
import { Box, Button, Heading, Text, VStack, HStack, Container } from "@chakra-ui/react";

interface SimpleGettingStartedProps {
  onClose: () => void;
}

const SimpleGettingStarted: React.FC<SimpleGettingStartedProps> = ({ onClose }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: "Complete Your Profile",
      description: "Add company information and verify your contact details",
    },
    {
      title: "Register Your First Valve",
      description: "Create a blockchain record for a valve you manufacture",
    },
    {
      title: "Set Up Team Access",
      description: "Invite team members and configure user permissions",
    },
    {
      title: "Configure Quality Standards",
      description: "Set up your quality control and certification processes",
    },
  ];

  const toggleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  return (
    <Box bg="#f8fafc" minH="100vh" py={8}>
      <Container maxW="800px" px={{ base: 4, md: 8 }}>
        <VStack spacing={8}>
          <VStack spacing={4} textAlign="center">
            <Heading size="lg" color="#1e3a8a">
              ValveChain
            </Heading>
            <Heading size="2xl" color="#1e3a8a" fontWeight="bold">
              Welcome to ValveChain
            </Heading>
            <Text color="#64748b" fontSize="lg" maxW="600px">
              Follow this guide to get your account set up and start managing your valve operations securely and efficiently.
            </Text>
          </VStack>

          {/* Progress Overview */}
          <Box w="full" bg="white" p={6} borderRadius="xl" shadow="sm">
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Heading size="md" color="#1e3a8a">
                  Setup Progress
                </Heading>
                <Text color="#64748b" fontSize="sm">
                  {completedSteps.length} of {steps.length} steps completed
                </Text>
              </VStack>
              <VStack align="end" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="#10b981">
                  {Math.round((completedSteps.length / steps.length) * 100)}%
                </Text>
                <Text fontSize="sm" color="#64748b">
                  Complete
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Getting Started Steps */}
          <Box w="full" bg="white" p={6} borderRadius="xl" shadow="sm">
            <VStack spacing={6} align="stretch">
              <Heading size="lg" color="#1e3a8a">
                Getting Started Checklist
              </Heading>
              
              <VStack spacing={4} align="stretch">
                {steps.map((step, index) => (
                  <Box key={index} p={4} borderRadius="lg" border="1px solid #e2e8f0">
                    <HStack justify="space-between" align="start">
                      <HStack spacing={3} flex="1">
                        <Button
                          size="sm"
                          borderRadius="full"
                          bg={completedSteps.includes(index) ? "#10b981" : "#e2e8f0"}
                          color={completedSteps.includes(index) ? "white" : "#64748b"}
                          _hover={{
                            bg: completedSteps.includes(index) ? "#059669" : "#cbd5e1"
                          }}
                          onClick={() => toggleStepComplete(index)}
                        >
                          {completedSteps.includes(index) ? "✓" : index + 1}
                        </Button>
                        <VStack align="start" spacing={1} flex="1">
                          <Heading size="md" color="#1e3a8a">
                            {step.title}
                          </Heading>
                          <Text color="#64748b" fontSize="sm">
                            {step.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </VStack>
          </Box>

          {/* Success Message */}
          {completedSteps.length === steps.length && (
            <Box bg="#ecfdf5" border="1px solid #10b981" borderRadius="xl" p={4}>
              <VStack align="start" spacing={1}>
                <Text fontWeight="600" color="#047857">
                  ✓ Congratulations! You've completed the setup process.
                </Text>
                <Text fontSize="sm" color="#047857">
                  Your ValveChain account is now ready for full operation. Start managing your valves with confidence.
                </Text>
              </VStack>
            </Box>
          )}

          {/* Action Buttons */}
          <HStack spacing={4}>
            <Button
              size="lg"
              bg="#10b981"
              color="white"
              _hover={{ bg: "#059669" }}
              px={8}
              onClick={onClose}
            >
              Go to Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="blue"
              px={8}
            >
              Need Help?
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default SimpleGettingStarted;