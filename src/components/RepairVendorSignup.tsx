
import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react';

const RepairVendorSignup: React.FC = () => {
  const [vendorName, setVendorName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [msuFile, setMsuFile] = useState<File | null>(null);
  const toast = useToast();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (vendorName && contactEmail && msuFile) {
      // Simulate form submission
      setTimeout(() => {
        toast({
          title: 'Signup Successful',
          description: 'Your information has been submitted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }, 1000);
    } else {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="500px" mx="auto" mt="5">
      <form onSubmit={handleFormSubmit}>
        <VStack spacing="4">
          <FormControl id="vendor-name" isRequired>
            <FormLabel>Vendor Name</FormLabel>
            <Input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </FormControl>

          <FormControl id="contact-email" isRequired>
            <FormLabel>Contact Email</FormLabel>
            <Input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </FormControl>

          <FormControl id="upload-msa" isRequired>
            <FormLabel>Upload MSA (PDF)</FormLabel>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setMsuFile(e.target.files ? e.target.files[0] : null)}
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full">
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RepairVendorSignup;
