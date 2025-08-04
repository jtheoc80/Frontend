import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Heading,
  Text,
  Progress,
  Container,
  Card,
  CardBody,
  Select,
  Textarea,
  Checkbox,
  Alert,
} from "@chakra-ui/react";

interface FormData {
  // Step 1: Basic Information
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  
  // Step 2: Organization Details
  organizationType: string;
  industryType: string;
  companySize: string;
  address: string;
  
  // Step 3: System Requirements
  valveTypes: string[];
  integrationNeeds: string;
  complianceRequirements: string[];
  
  // Step 4: Account Setup
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

interface RegistrationWizardProps {
  onComplete: (data: FormData) => void;
  onCancel: () => void;
}

const RegistrationWizard: React.FC<RegistrationWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    organizationType: "",
    industryType: "",
    companySize: "",
    address: "",
    valveTypes: [],
    integrationNeeds: "",
    complianceRequirements: [],
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const steps = [
    {
      title: "Basic Information",
      description: "Company and contact details",
    },
    {
      title: "Organization Details", 
      description: "Industry and business information",
    },
    {
      title: "System Requirements",
      description: "Technical and compliance needs",
    },
    {
      title: "Account Setup",
      description: "Security and terms",
    },
  ];

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (stepIndex) {
      case 0:
        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
        if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        break;
        
      case 1:
        if (!formData.organizationType) newErrors.organizationType = "Organization type is required";
        if (!formData.industryType) newErrors.industryType = "Industry type is required";
        if (!formData.companySize) newErrors.companySize = "Company size is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        break;
        
      case 2:
        if (formData.valveTypes.length === 0) newErrors.valveTypes = "Select at least one valve type";
        if (!formData.integrationNeeds.trim()) newErrors.integrationNeeds = "Integration needs are required";
        break;
        
      case 3:
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms of service";
        if (!formData.acceptPrivacy) newErrors.acceptPrivacy = "You must accept the privacy policy";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete(formData);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <VStack spacing={6}>
            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Company Name</Text>
              <Input
                value={formData.companyName}
                onChange={(e) => updateFormData("companyName", e.target.value)}
                placeholder="Enter your company name"
                size="lg"
                borderColor={errors.companyName ? "red.300" : "silverGray.300"}
              />
              {errors.companyName && (
                <Text color="red.500" fontSize="sm">{errors.companyName}</Text>
              )}
            </VStack>

            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Primary Contact Name</Text>
              <Input
                value={formData.contactName}
                onChange={(e) => updateFormData("contactName", e.target.value)}
                placeholder="Enter primary contact name"
                size="lg"
                borderColor={errors.contactName ? "red.300" : "silverGray.300"}
              />
              {errors.contactName && (
                <Text color="red.500" fontSize="sm">{errors.contactName}</Text>
              )}
            </VStack>

            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Business Email</Text>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="name@company.com"
                size="lg"
                borderColor={errors.email ? "red.300" : "silverGray.300"}
              />
              {errors.email && (
                <Text color="red.500" fontSize="sm">{errors.email}</Text>
              )}
            </VStack>

            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Phone Number</Text>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                size="lg"
                borderColor={errors.phone ? "red.300" : "silverGray.300"}
              />
              {errors.phone && (
                <Text color="red.500" fontSize="sm">{errors.phone}</Text>
              )}
            </VStack>
          </VStack>
        );

      case 1:
        return (
          <VStack spacing={6}>
            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Organization Type</Text>
              <Select
                value={formData.organizationType}
                onChange={(e) => updateFormData("organizationType", e.target.value)}
                placeholder="Select organization type"
                size="lg"
                borderColor={errors.organizationType ? "red.300" : "silverGray.300"}
              >
                <option value="manufacturer">Valve Manufacturer</option>
                <option value="plant">Industrial Plant/Facility</option>
                <option value="distributor">Distributor</option>
                <option value="maintenance">Maintenance/Repair Vendor</option>
                <option value="auditor">Auditor/Compliance</option>
              </Select>
              {errors.organizationType && (
                <Text color="red.500" fontSize="sm">{errors.organizationType}</Text>
              )}
            </VStack>

            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Industry Type</Text>
              <Select
                value={formData.industryType}
                onChange={(e) => updateFormData("industryType", e.target.value)}
                placeholder="Select industry type"
                size="lg"
                borderColor={errors.industryType ? "red.300" : "silverGray.300"}
              >
                <option value="oil-gas">Oil & Gas</option>
                <option value="chemical">Chemical Processing</option>
                <option value="power">Power Generation</option>
                <option value="water">Water Treatment</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="pharmaceutical">Pharmaceutical</option>
                <option value="food-beverage">Food & Beverage</option>
                <option value="other">Other</option>
              </Select>
              {errors.industryType && (
                <Text color="red.500" fontSize="sm">{errors.industryType}</Text>
              )}
            </VStack>

            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Company Size</Text>
              <Select
                value={formData.companySize}
                onChange={(e) => updateFormData("companySize", e.target.value)}
                placeholder="Select company size"
                size="lg"
                borderColor={errors.companySize ? "red.300" : "silverGray.300"}
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1,000 employees</option>
                <option value="1000+">1,000+ employees</option>
              </Select>
              {errors.companySize && (
                <Text color="red.500" fontSize="sm">{errors.companySize}</Text>
              )}
            </VStack>

            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Business Address</Text>
              <Textarea
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                placeholder="Enter complete business address"
                size="lg"
                rows={3}
                borderColor={errors.address ? "red.300" : "silverGray.300"}
              />
              {errors.address && (
                <Text color="red.500" fontSize="sm">{errors.address}</Text>
              )}
            </VStack>
          </VStack>
        );

      case 2:
        return (
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Valve Types (Select all that apply)</Text>
              <VStack align="stretch" spacing={2}>
                {[
                  "Gate Valves",
                  "Ball Valves", 
                  "Globe Valves",
                  "Check Valves",
                  "Butterfly Valves",
                  "Plug Valves",
                  "Control Valves",
                  "Safety Relief Valves"
                ].map((valve) => (
                  <Checkbox
                    key={valve}
                    isChecked={formData.valveTypes.includes(valve)}
                    onChange={(e) => {
                      const newTypes = e.target.checked 
                        ? [...formData.valveTypes, valve]
                        : formData.valveTypes.filter(t => t !== valve);
                      updateFormData("valveTypes", newTypes);
                    }}
                    colorScheme="emeraldGreen"
                  >
                    {valve}
                  </Checkbox>
                ))}
              </VStack>
              {errors.valveTypes && (
                <Text color="red.500" fontSize="sm">{errors.valveTypes}</Text>
              )}
            </VStack>

            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Integration Requirements</Text>
              <Textarea
                value={formData.integrationNeeds}
                onChange={(e) => updateFormData("integrationNeeds", e.target.value)}
                placeholder="Describe your integration needs with existing systems (ERP, CMMS, etc.)"
                size="lg"
                rows={4}
                borderColor={errors.integrationNeeds ? "red.300" : "silverGray.300"}
              />
              {errors.integrationNeeds && (
                <Text color="red.500" fontSize="sm">{errors.integrationNeeds}</Text>
              )}
            </VStack>

            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Compliance Requirements (Select all that apply)</Text>
              <VStack align="stretch" spacing={2}>
                {[
                  "API Standards",
                  "ASME Standards",
                  "ISO Certification",
                  "FDA Compliance",
                  "OSHA Requirements",
                  "Environmental Regulations"
                ].map((compliance) => (
                  <Checkbox
                    key={compliance}
                    isChecked={formData.complianceRequirements.includes(compliance)}
                    onChange={(e) => {
                      const newReqs = e.target.checked 
                        ? [...formData.complianceRequirements, compliance]
                        : formData.complianceRequirements.filter(r => r !== compliance);
                      updateFormData("complianceRequirements", newReqs);
                    }}
                    colorScheme="emeraldGreen"
                  >
                    {compliance}
                  </Checkbox>
                ))}
              </VStack>
            </VStack>
          </VStack>
        );

      case 3:
        return (
          <VStack spacing={6}>
            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Password</Text>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                placeholder="Enter secure password (min 8 characters)"
                size="lg"
                borderColor={errors.password ? "red.300" : "silverGray.300"}
              />
              {errors.password && (
                <Text color="red.500" fontSize="sm">{errors.password}</Text>
              )}
            </VStack>

            <VStack spacing={2} align="start" w="full">
              <Text fontWeight="600" color="deepBlue.700">Confirm Password</Text>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                size="lg"
                borderColor={errors.confirmPassword ? "red.300" : "silverGray.300"}
              />
              {errors.confirmPassword && (
                <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>
              )}
            </VStack>

            <VStack spacing={4} align="stretch" w="full">
              <VStack spacing={2} align="start" w="full">
                <Checkbox
                  isChecked={formData.acceptTerms}
                  onChange={(e) => updateFormData("acceptTerms", e.target.checked)}
                  colorScheme="emeraldGreen"
                >
                  <Text fontSize="sm">
                    I accept the{" "}
                    <Text as="span" color="emeraldGreen.500" textDecoration="underline" cursor="pointer">
                      Terms of Service
                    </Text>
                  </Text>
                </Checkbox>
                {errors.acceptTerms && (
                  <Text color="red.500" fontSize="sm">{errors.acceptTerms}</Text>
                )}
              </VStack>

              <VStack spacing={2} align="start" w="full">
                <Checkbox
                  isChecked={formData.acceptPrivacy}
                  onChange={(e) => updateFormData("acceptPrivacy", e.target.checked)}
                  colorScheme="emeraldGreen"
                >
                  <Text fontSize="sm">
                    I accept the{" "}
                    <Text as="span" color="emeraldGreen.500" textDecoration="underline" cursor="pointer">
                      Privacy Policy
                    </Text>
                  </Text>
                </Checkbox>
                {errors.acceptPrivacy && (
                  <Text color="red.500" fontSize="sm">{errors.acceptPrivacy}</Text>
                )}
              </VStack>
            </VStack>

            <Alert status="info" borderRadius="md">
              <Text fontSize="sm">
                ℹ️ Your account will be reviewed and activated within 24 hours. You'll receive an email confirmation once approved.
              </Text>
            </Alert>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box bg="silverGray.50" minH="100vh" py={8}>
      <Container maxW="800px" px={{ base: 4, md: 8 }}>
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Box 
              as="img" 
              src="/src/assets/logo.svg" 
              alt="ValveChain"
              h="40px"
              w="auto"
            />
            <Heading size="xl" color="deepBlue.900" fontWeight="700">
              Create Your ValveChain Account
            </Heading>
            <Text color="silverGray.600" fontSize="lg">
              Join the future of industrial valve management
            </Text>
          </VStack>

          {/* Progress Indicator */}
          <Box w="full" maxW="600px">
            <VStack spacing={4}>
              <Progress 
                value={(currentStep + 1) / steps.length * 100} 
                size="lg" 
                colorScheme="emeraldGreen"
                w="full"
                borderRadius="full"
              />
              <HStack justify="space-between" w="full" fontSize="sm">
                {steps.map((step, index) => (
                  <VStack key={index} spacing={1} flex="1" textAlign="center">
                    <Box
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      bg={index <= currentStep ? "emeraldGreen.500" : "silverGray.300"}
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="sm"
                      fontWeight="600"
                    >
                      {index < currentStep ? "✓" : index + 1}
                    </Box>
                    <Text 
                      fontSize="xs" 
                      color={index <= currentStep ? "emeraldGreen.600" : "silverGray.500"}
                      fontWeight="500"
                      textAlign="center"
                      maxW="80px"
                    >
                      {step.title}
                    </Text>
                  </VStack>
                ))}
              </HStack>
            </VStack>
          </Box>

          {/* Form Card */}
          <Card w="full" maxW="600px" borderRadius="xl" shadow="lg">
            <CardBody p={8}>
              <VStack spacing={8}>
                <VStack spacing={2} textAlign="center">
                  <Heading size="md" color="deepBlue.800">
                    {steps[currentStep].title}
                  </Heading>
                  <Text color="silverGray.600" fontSize="sm">
                    {steps[currentStep].description}
                  </Text>
                </VStack>

                {renderStepContent()}

                {/* Navigation Buttons */}
                <HStack spacing={4} w="full" justify="space-between">
                  <Button
                    variant="outline"
                    onClick={currentStep === 0 ? onCancel : handlePrevious}
                    isDisabled={isSubmitting}
                    colorScheme="silverGray"
                    aria-label={currentStep === 0 ? "Cancel registration" : "Go to previous step"}
                  >
                    {currentStep === 0 ? "Cancel" : "Previous"}
                  </Button>

                  <Button
                    bg="emeraldGreen.500"
                    color="white"
                    _hover={{ bg: "emeraldGreen.600" }}
                    onClick={handleNext}
                    isLoading={isSubmitting}
                    loadingText="Creating Account..."
                    aria-label={currentStep === steps.length - 1 ? "Create account" : "Continue to next step"}
                  >
                    {currentStep === steps.length - 1 ? "Create Account" : "Continue"}
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default RegistrationWizard;