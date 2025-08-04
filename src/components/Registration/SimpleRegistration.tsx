import React, { useState } from "react";
import { Box, Button, Input, VStack, HStack, Heading, Text, Container } from "@chakra-ui/react";

interface SimpleRegistrationProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const SimpleRegistration: React.FC<SimpleRegistrationProps> = ({ onComplete, onCancel }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <Box bg="#f8fafc" minH="100vh" py={8}>
      <Container maxW="600px" px={{ base: 4, md: 8 }}>
        <VStack spacing={8}>
          <VStack spacing={4} textAlign="center">
            <Heading size="lg" color="#1e3a8a">
              ValveChain
            </Heading>
            <Heading size="xl" color="#1e3a8a" fontWeight="bold">
              Create Your Account
            </Heading>
            <Text color="#64748b" fontSize="lg">
              Join the future of industrial valve management
            </Text>
          </VStack>

          <Box w="full" maxW="500px" bg="white" p={8} borderRadius="xl" shadow="lg">
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <VStack spacing={2} align="start" w="full">
                  <Text fontWeight="600" color="#1e3a8a">Company Name</Text>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Enter your company name"
                    size="lg"
                    required
                  />
                </VStack>

                <VStack spacing={2} align="start" w="full">
                  <Text fontWeight="600" color="#1e3a8a">Contact Name</Text>
                  <Input
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Enter primary contact name"
                    size="lg"
                    required
                  />
                </VStack>

                <VStack spacing={2} align="start" w="full">
                  <Text fontWeight="600" color="#1e3a8a">Business Email</Text>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="name@company.com"
                    size="lg"
                    required
                  />
                </VStack>

                <VStack spacing={2} align="start" w="full">
                  <Text fontWeight="600" color="#1e3a8a">Phone Number</Text>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    size="lg"
                    required
                  />
                </VStack>

                <HStack spacing={4} w="full" justify="space-between" pt={4}>
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    colorScheme="gray"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    bg="#10b981"
                    color="white"
                    _hover={{ bg: "#059669" }}
                  >
                    Create Account
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default SimpleRegistration;