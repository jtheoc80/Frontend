import React, { useState } from 'react';
import { Box, Button, Input, VStack, useToast, FormLabel, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PasswordResetConfirm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter both password and confirmation.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 8 characters long.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post('/api/reset_password_confirm', {
        token,
        password
      });

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Password has been reset successfully. You can now login with your new password.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Clear form
        setPassword('');
        setConfirmPassword('');
      }
      
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
      let errorMessage = 'Error resetting password. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Invalid or expired reset token. Please request a new password reset.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Reset token not found. Please request a new password reset.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait before trying again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Reset Failed',
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
          <Text fontSize="lg" fontWeight="bold">Reset Your Password</Text>
          
          <Box width="100%">
            <FormLabel htmlFor="password">New Password</FormLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Box>
          
          <Box width="100%">
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </Box>
          
          <Button 
            type="submit" 
            colorScheme="blue" 
            width="100%"
            isLoading={loading}
            loadingText="Resetting..."
          >
            Reset Password
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default PasswordResetConfirm;