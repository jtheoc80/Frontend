import React, { useState } from 'react';
import { Box, Button, Input, VStack, useToast, FormLabel, Text } from '@chakra-ui/react';
import axios from 'axios';

const TwoFactorAuth: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!code.trim()) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter your 2FA code.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post('/api/verify_2fa', { code });
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: '2FA verified successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Clear the form
        setCode('');
        
      } else {
        toast({
          title: 'Invalid Code',
          description: 'Invalid 2FA code. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      
    } catch (error: any) {
      console.error('Error verifying 2FA code:', error);
      
      let errorMessage = 'Error verifying 2FA code. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid 2FA code. Please check your code and try again.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many attempts. Please wait before trying again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Verification Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="400px" mx="auto" p={6} borderWidth={1} borderRadius="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Text fontSize="lg" fontWeight="bold">Two-Factor Authentication</Text>
          
          <Box width="100%">
            <FormLabel htmlFor="code">Enter your 6-digit code</FormLabel>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              pattern="[0-9]{6}"
            />
          </Box>
          
          <Button 
            type="submit" 
            colorScheme="blue" 
            width="100%"
            isLoading={loading}
            loadingText="Verifying..."
          >
            Verify Code
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TwoFactorAuth;