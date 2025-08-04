import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Container,
  Card,
  CardBody,
  Badge,
  SimpleGrid,
  Alert,
} from "@chakra-ui/react";

interface GettingStartedGuideProps {
  userRole?: string;
  onClose: () => void;
}

const GettingStartedGuide: React.FC<GettingStartedGuideProps> = ({ userRole = "manufacturer", onClose }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([0]);

  const toggleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const toggleStepExpanded = (stepIndex: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const getStepsForRole = (role: string) => {
    const commonSteps = [
      {
        title: "Complete Your Profile",
        description: "Add company information and verify your contact details",
        tasks: [
          "Upload company logo and documentation",
          "Verify email address and phone number", 
          "Set up two-factor authentication",
          "Configure notification preferences"
        ],
        estimatedTime: "10 minutes"
      },
      {
        title: "Set Up Team Access",
        description: "Invite team members and configure user permissions",
        tasks: [
          "Invite team members by email",
          "Assign appropriate roles and permissions",
          "Set up approval workflows", 
          "Configure access controls"
        ],
        estimatedTime: "15 minutes"
      }
    ];

    const roleSpecificSteps = {
      manufacturer: [
        {
          title: "Register Your First Valve",
          description: "Create a blockchain record for a valve you manufacture",
          tasks: [
            "Enter valve specifications and serial number",
            "Upload manufacturing documentation",
            "Add quality certifications and test results",
            "Generate QR code for physical valve tagging"
          ],
          estimatedTime: "20 minutes"
        },
        {
          title: "Configure Quality Standards",
          description: "Set up your quality control and certification processes",
          tasks: [
            "Define your quality control checkpoints",
            "Upload standard certification templates",
            "Set up automated compliance checks",
            "Configure customer notification workflows"
          ],
          estimatedTime: "30 minutes"
        }
      ],
      plant: [
        {
          title: "Import Your Valve Inventory",
          description: "Add existing valves to the ValveChain system",
          tasks: [
            "Scan QR codes or enter valve serial numbers",
            "Import valve data from existing systems",
            "Verify manufacturer information",
            "Set up maintenance schedules"
          ],
          estimatedTime: "30 minutes"
        },
        {
          title: "Configure Maintenance Workflows",
          description: "Set up automated maintenance and compliance tracking",
          tasks: [
            "Define maintenance intervals by valve type",
            "Set up compliance monitoring rules",
            "Configure alert thresholds and notifications",
            "Integrate with existing CMMS systems"
          ],
          estimatedTime: "25 minutes"
        }
      ],
      maintenance: [
        {
          title: "Set Up Service Capabilities",
          description: "Define the types of valve services you provide",
          tasks: [
            "List your service offerings and certifications",
            "Upload technician credentials and training records",
            "Set up service pricing and availability",
            "Configure work order management"
          ],
          estimatedTime: "25 minutes"
        },
        {
          title: "Complete Your First Service Record",
          description: "Document a valve maintenance or repair job",
          tasks: [
            "Scan valve QR code to access history",
            "Document service performed and parts used",
            "Upload photos and test results",
            "Update valve status and recommendations"
          ],
          estimatedTime: "15 minutes"
        }
      ]
    };

    return [...commonSteps, ...(roleSpecificSteps[role as keyof typeof roleSpecificSteps] || [])];
  };

  const steps = getStepsForRole(userRole);

  const quickLinks = [
    {
      title: "API Documentation",
      description: "Integrate ValveChain with your existing systems",
      action: "View Docs",
      color: "deepBlue"
    },
    {
      title: "Video Tutorials", 
      description: "Watch step-by-step guidance for common tasks",
      action: "Watch Videos",
      color: "emeraldGreen"
    },
    {
      title: "Support Center",
      description: "Get help from our technical support team",
      action: "Contact Support", 
      color: "copper"
    },
    {
      title: "Community Forum",
      description: "Connect with other ValveChain users",
      action: "Join Forum",
      color: "silverGray"
    }
  ];

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      manufacturer: "Valve Manufacturer",
      plant: "Plant Operator", 
      maintenance: "Maintenance Provider",
      distributor: "Distributor",
      auditor: "Auditor"
    };
    return roleNames[role as keyof typeof roleNames] || "User";
  };

  return (
    <Box bg="silverGray.50" minH="100vh" py={8}>
      <Container maxW="1000px" px={{ base: 4, md: 8 }}>
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <HStack>
              <Box 
                as="img" 
                src="/src/assets/logo.svg" 
                alt="ValveChain"
                h="32px"
                w="auto"
              />
              <Badge colorScheme="emeraldGreen" px={3} py={1} borderRadius="full">
                {getRoleDisplayName(userRole)}
              </Badge>
            </HStack>
            <Heading size="2xl" color="deepBlue.900" fontWeight="700">
              Welcome to ValveChain
            </Heading>
            <Text color="silverGray.600" fontSize="lg" maxW="600px">
              Follow this guide to get your account set up and start managing your valve operations securely and efficiently.
            </Text>
          </VStack>

          {/* Progress Overview */}
          <Card w="full" borderRadius="xl" bg="white" shadow="sm">
            <CardBody p={6}>
              <HStack justify="space-between" align="center">
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="deepBlue.800">
                    Setup Progress
                  </Heading>
                  <Text color="silverGray.600" fontSize="sm">
                    {completedSteps.length} of {steps.length} steps completed
                  </Text>
                </VStack>
                <VStack align="end" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="emeraldGreen.500">
                    {Math.round((completedSteps.length / steps.length) * 100)}%
                  </Text>
                  <Text fontSize="sm" color="silverGray.500">
                    Complete
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          {/* Getting Started Steps */}
          <Card w="full" borderRadius="xl" bg="white" shadow="sm">
            <CardBody p={6}>
              <VStack spacing={6} align="stretch">
                <Heading size="lg" color="deepBlue.800">
                  Getting Started Checklist
                </Heading>
                
                <VStack spacing={4} align="stretch">
                  {steps.map((step, index) => (
                    <Card key={index} borderRadius="lg" border="1px" borderColor="silverGray.200">
                      <CardBody p={4}>
                        <VStack align="stretch" spacing={3}>
                          {/* Step Header */}
                          <HStack justify="space-between" align="start">
                            <HStack spacing={3} flex="1">
                              <Button
                                size="sm"
                                borderRadius="full"
                                bg={completedSteps.includes(index) ? "emeraldGreen.500" : "silverGray.200"}
                                color={completedSteps.includes(index) ? "white" : "silverGray.600"}
                                _hover={{
                                  bg: completedSteps.includes(index) ? "emeraldGreen.600" : "silverGray.300"
                                }}
                                onClick={() => toggleStepComplete(index)}
                                aria-label={`Mark step ${index + 1} as ${completedSteps.includes(index) ? 'incomplete' : 'complete'}`}
                              >
                                {completedSteps.includes(index) ? "✓" : index + 1}
                              </Button>
                              <VStack align="start" spacing={1} flex="1">
                                <HStack>
                                  <Heading size="md" color="deepBlue.800">
                                    {step.title}
                                  </Heading>
                                  <Badge size="sm" colorScheme="copper" variant="subtle">
                                    {step.estimatedTime}
                                  </Badge>
                                </HStack>
                                <Text color="silverGray.600" fontSize="sm">
                                  {step.description}
                                </Text>
                              </VStack>
                            </HStack>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleStepExpanded(index)}
                              aria-label={`${expandedSteps.includes(index) ? 'Collapse' : 'Expand'} step details`}
                            >
                              {expandedSteps.includes(index) ? "−" : "+"}
                            </Button>
                          </HStack>

                          {/* Step Details */}
                          {expandedSteps.includes(index) && (
                            <VStack align="stretch" spacing={3} ml={12} pt={2}>
                              {step.tasks.map((task, taskIndex) => (
                                <HStack key={taskIndex} align="start" spacing={3}>
                                  <Box
                                    w="6px"
                                    h="6px"
                                    bg="emeraldGreen.400"
                                    borderRadius="full"
                                    mt={2}
                                    flexShrink={0}
                                  />
                                  <Text color="silverGray.700" fontSize="sm">
                                    {task}
                                  </Text>
                                </HStack>
                              ))}
                              <HStack mt={4}>
                                <Button
                                  size="sm"
                                  bg="emeraldGreen.500"
                                  color="white"
                                  _hover={{ bg: "emeraldGreen.600" }}
                                  onClick={() => toggleStepComplete(index)}
                                  aria-label={`Mark step "${step.title}" as complete`}
                                >
                                  {completedSteps.includes(index) ? "Mark Incomplete" : "Mark Complete"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  colorScheme="deepBlue"
                                  aria-label={`Get help with step "${step.title}"`}
                                >
                                  Get Help
                                </Button>
                              </HStack>
                            </VStack>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Links */}
          <Card w="full" borderRadius="xl" bg="white" shadow="sm">
            <CardBody p={6}>
              <VStack spacing={6} align="stretch">
                <Heading size="lg" color="deepBlue.800">
                  Quick Links & Resources
                </Heading>
                
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                  {quickLinks.map((link, index) => (
                    <Card 
                      key={index}
                      borderRadius="lg" 
                      border="1px"
                      borderColor="silverGray.200"
                      _hover={{ 
                        shadow: "md", 
                        transform: "translateY(-2px)",
                        borderColor: `${link.color}.200`
                      }}
                      transition="all 0.2s"
                      cursor="pointer"
                    >
                      <CardBody p={4}>
                        <VStack spacing={3} textAlign="center">
                          <Heading size="sm" color="deepBlue.800">
                            {link.title}
                          </Heading>
                          <Text color="silverGray.600" fontSize="xs" lineHeight="1.4">
                            {link.description}
                          </Text>
                          <Button
                            size="xs"
                            colorScheme={link.color}
                            variant="outline"
                            aria-label={`${link.action} for ${link.title}`}
                          >
                            {link.action}
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Success Message */}
          {completedSteps.length === steps.length && (
            <Alert status="success" borderRadius="xl" bg="emeraldGreen.50" borderColor="emeraldGreen.200">
              <VStack align="start" spacing={1}>
                <Text fontWeight="600" color="emeraldGreen.800">
                  ✓ Congratulations! You've completed the setup process.
                </Text>
                <Text fontSize="sm" color="emeraldGreen.700">
                  Your ValveChain account is now ready for full operation. Start managing your valves with confidence.
                </Text>
              </VStack>
            </Alert>
          )}

          {/* Action Buttons */}
          <HStack spacing={4}>
            <Button
              size="lg"
              bg="emeraldGreen.500"
              color="white"
              _hover={{ bg: "emeraldGreen.600" }}
              px={8}
              onClick={onClose}
              aria-label="Go to dashboard"
            >
              Go to Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="deepBlue"
              px={8}
              aria-label="Contact support for assistance"
            >
              Need Help?
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default GettingStartedGuide;