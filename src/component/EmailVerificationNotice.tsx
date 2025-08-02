import React, { useState } from 'react';
import { Box, Button, Text, useToast, VStack } from '@chakra-ui/react';
import axios from 'axios';

const EmailVerificationNotice: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const resendVerificationEmail = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post('/api/send_verification_email');
      
      if (response.status === 200) {
        toast({
          title: 'Email Sent',
          description: 'Verification email has been resent. Please check your inbox.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      
      let errorMessage = 'Error resending verification email. Please try again later.';
      
      if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait before requesting another email.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Verification service not available. Please contact support.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
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
    <Box className="email-verification-notice" p={4} borderWidth={1} borderRadius="md">
      <VStack spacing={4}>
        <Text>Please check your email to verify your account.</Text>
        <Button 
          onClick={resendVerificationEmail}
          colorScheme="blue"
          isLoading={loading}
          loadingText="Sending..."
        >
          Resend Verification Email
        </Button>
      </VStack>
    </Box>
  );
};

export default EmailVerificationNotice;