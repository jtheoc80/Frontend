import { userApiService } from '../services/userApi';

describe('UserApiService', () => {
  beforeEach(() => {
    // Reset the service state for each test
    jest.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return current user profile', async () => {
      const result = await userApiService.getCurrentUser();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe('user001');
      expect(result.data?.companyName).toBe('Emerson Process Management');
      expect(result.data?.role).toBe('manufacturer');
      expect(result.data?.isActive).toBe(true);
    });
  });

  describe('updateUserProfile', () => {
    it('should successfully update user profile', async () => {
      const updates = {
        companyName: 'Updated Company Name',
        contactName: 'Jane Smith'
      };

      const result = await userApiService.updateUserProfile(updates);
      
      expect(result.success).toBe(true);
      expect(result.data?.companyName).toBe('Updated Company Name');
      expect(result.data?.contactName).toBe('Jane Smith');
      expect(result.message).toBe('Profile updated successfully');
    });

    it('should validate email format', async () => {
      const updates = {
        email: 'invalid-email'
      };

      const result = await userApiService.updateUserProfile(updates);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid email format');
      expect(result.errors).toContain('Please enter a valid email address');
    });
  });

  describe('deleteUserProfile', () => {
    it('should successfully delete user profile', async () => {
      const deleteRequest = {
        userId: 'user001',
        reason: 'Testing'
      };

      const result = await userApiService.deleteUserProfile(deleteRequest);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Profile deleted successfully');
    });

    it('should fail when trying to delete non-existent user', async () => {
      const deleteRequest = {
        userId: 'nonexistent',
        reason: 'Testing'
      };

      const result = await userApiService.deleteUserProfile(deleteRequest);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('User not found');
      expect(result.errors).toContain('Invalid user ID');
    });

    it('should prevent unauthorized profile deletion', async () => {
      const deleteRequest = {
        userId: 'user002', // Different user
        reason: 'Testing'
      };

      const result = await userApiService.deleteUserProfile(deleteRequest);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Unauthorized to delete this profile');
      expect(result.errors).toContain('You can only delete your own profile');
    });
  });

  describe('canDeleteProfile', () => {
    it('should allow user to delete their own profile', () => {
      const canDelete = userApiService.canDeleteProfile('user001');
      expect(canDelete).toBe(true);
    });

    it('should not allow user to delete other profiles', () => {
      const canDelete = userApiService.canDeleteProfile('user002');
      expect(canDelete).toBe(false);
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const result = await userApiService.getUserById('user001');
      
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('user001');
    });

    it('should return error for non-existent user', async () => {
      const result = await userApiService.getUserById('nonexistent');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('User not found');
      expect(result.errors).toContain('Invalid user ID');
    });
  });

  describe('Access Control', () => {
    it('should enforce proper access control for profile operations', () => {
      // Test that only profile owners can see deletion option
      expect(userApiService.canDeleteProfile('user001')).toBe(true);
      expect(userApiService.canDeleteProfile('user002')).toBe(false);
    });
  });
});