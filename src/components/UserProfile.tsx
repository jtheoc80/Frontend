import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Container,
  Spinner
} from "@chakra-ui/react";
import { userApiService } from "../services/userApi.ts";
import { UserProfile as UserProfileType } from "../types/user";

interface UserProfileProps {
  onAccountDeleted?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onAccountDeleted }) => {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
  });

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userApiService.getCurrentUser();
      
      if (response.success && response.data) {
        setUserProfile(response.data);
        setFormData({
          companyName: response.data.companyName,
          contactName: response.data.contactName,
          email: response.data.email,
          phone: response.data.phone,
        });
      } else {
        setAlert({ type: 'error', message: response.message || 'Failed to load profile' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setAlert(null);
      
      const response = await userApiService.updateUserProfile(formData);
      
      if (response.success && response.data) {
        setUserProfile(response.data);
        setAlert({ type: 'success', message: 'Profile updated successfully' });
      } else {
        setAlert({ 
          type: 'error', 
          message: response.message || 'Failed to update profile' 
        });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!userProfile) return;
    
    // Use browser confirmation dialog
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account?\n\n" +
      "This will permanently delete your profile and remove all associated data. " +
      "This action cannot be undone."
    );
    
    if (!confirmed) return;
    
    try {
      setDeleting(true);
      
      const response = await userApiService.deleteUserProfile({
        userId: userProfile.id
      });
      
      if (response.success) {
        setAlert({ type: 'success', message: 'Account deleted successfully' });
        
        // Notify parent component (e.g., to redirect to landing page)
        if (onAccountDeleted) {
          setTimeout(() => onAccountDeleted(), 2000);
        }
      } else {
        setAlert({ 
          type: 'error', 
          message: response.message || 'Failed to delete account' 
        });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setDeleting(false);
    }
  };

  const canDeleteProfile = userProfile ? userApiService.canDeleteProfile(userProfile.id) : false;

  if (loading) {
    return (
      <Container maxW="800px" py={8}>
        <VStack spacing={4}>
          <Spinner size="lg" color="#1e3a8a" />
          <Text>Loading profile...</Text>
        </VStack>
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container maxW="800px" py={8}>
        <Box bg="#fed7e2" p={4} borderRadius="md" border="1px solid #f56565">
          <Text color="#c53030" fontWeight="600">
            Unable to load user profile. Please try again.
          </Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="800px" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <VStack spacing={4} align="start">
          <Heading size="xl" color="#1e3a8a">
            Profile Settings
          </Heading>
          <HStack>
            <Box bg="#3182ce" color="white" px={2} py={1} borderRadius="md" fontSize="sm">
              {userProfile.role.replace('_', ' ').toUpperCase()}
            </Box>
            <Box bg={userProfile.isActive ? "#38a169" : "#e53e3e"} color="white" px={2} py={1} borderRadius="md" fontSize="sm">
              {userProfile.isActive ? "ACTIVE" : "INACTIVE"}
            </Box>
          </HStack>
        </VStack>

        {/* Alert Messages */}
        {alert && (
          <Box bg={alert.type === 'error' ? '#fed7e2' : '#c6f6d5'} p={4} borderRadius="md" border={`1px solid ${alert.type === 'error' ? '#f56565' : '#48bb78'}`}>
            <Text color={alert.type === 'error' ? '#c53030' : '#2f855a'} fontWeight="600">
              {alert.message}
            </Text>
          </Box>
        )}

        {/* Profile Form */}
        <Box bg="white" p={8} borderRadius="xl" shadow="lg">
          <form onSubmit={handleUpdateProfile}>
            <VStack spacing={6}>
              <Heading size="md" color="#1e3a8a" alignSelf="start">
                Account Information
              </Heading>

              <VStack spacing={4} align="start" w="full">
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
              </VStack>

              <HStack spacing={4} w="full" justify="end" pt={4}>
                <Button
                  type="submit"
                  bg="#10b981"
                  color="white"
                  _hover={{ bg: "#059669" }}
                  isLoading={updating}
                  loadingText="Updating..."
                >
                  Update Profile
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>

        {/* Account Deletion Section */}
        {canDeleteProfile && (
          <Box bg="white" p={8} borderRadius="xl" shadow="lg" borderColor="red.200" borderWidth="1px">
            <VStack spacing={6} align="start">
              <Heading size="md" color="red.600">
                Danger Zone
              </Heading>
              
              <VStack spacing={4} align="start">
                <Text color="#64748b">
                  Once you delete your account, there is no going back. Please be certain.
                </Text>
                
                <Text fontSize="sm" color="#64748b">
                  • All your data will be permanently removed
                  • You will lose access to all ValveChain services
                  • This action cannot be undone
                </Text>
              </VStack>

              <Box borderTop="1px solid #e2e8f0" pt={4} />

              <Button
                colorScheme="red"
                variant="outline"
                onClick={handleDeleteProfile}
                isLoading={deleting}
                loadingText="Deleting..."
              >
                Delete Account
              </Button>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default UserProfile;