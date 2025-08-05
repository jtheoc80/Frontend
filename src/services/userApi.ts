// Mock API service for user profile management
// This simulates the backend API that would handle user operations

import { 
  UserProfile, 
  DeleteProfileRequest, 
  DeleteProfileResponse
} from '../types/user';
import { ApiResponse } from '../types/valve';

// Factory function to provide a fresh mock user database
function getInitialMockUsers(): UserProfile[] {
  return [
    {
      id: 'user001',
      companyName: 'Emerson Process Management',
      contactName: 'John Smith',
      email: 'john.smith@emerson.com',
      phone: '+1 (555) 123-4567',
      createdAt: '2023-01-15T10:30:00Z',
      role: 'manufacturer',
      isActive: true
    },
    {
      id: 'user002',
      companyName: 'Kitz Corporation',
      contactName: 'Sarah Johnson',
      email: 'sarah.johnson@kitz.com',
      phone: '+1 (555) 987-6543',
      createdAt: '2023-02-20T14:15:00Z',
      role: 'manufacturer',
      isActive: true
    }
  ];
}

class UserApiService {
  private baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
  private mockUsers: UserProfile[];
  private currentUser: UserProfile;

  constructor() {
    this.mockUsers = getInitialMockUsers();
    this.currentUser = this.mockUsers[0];
  }
  /**
   * Simulate API delay for realistic testing
   */
  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    await this.delay(500);
    
    return {
      success: true,
      data: currentUser,
      message: 'User profile retrieved successfully'
    };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    await this.delay(800);
    
    try {
      // Validate required fields
      if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
        return {
          success: false,
          message: 'Invalid email format',
          errors: ['Please enter a valid email address']
        };
      }

      // Update current user
      currentUser = { ...currentUser, ...updates };
      
      // Update in mock database
      mockUsers = mockUsers.map(user => 
        user.id === currentUser.id ? currentUser : user
      );

      return {
        success: true,
        data: currentUser,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update profile',
        errors: ['An unexpected error occurred']
      };
    }
  }

  /**
   * Delete user profile (soft delete - marks as inactive)
   */
  async deleteUserProfile(request: DeleteProfileRequest): Promise<DeleteProfileResponse> {
    await this.delay(2000); // Simulate processing time for deletion
    
    try {
      // Validate user exists
      const userToDelete = mockUsers.find(user => user.id === request.userId);
      if (!userToDelete) {
        return {
          success: false,
          message: 'User not found',
          errors: ['Invalid user ID']
        };
      }

      // Check if user is trying to delete their own account
      if (request.userId !== currentUser.id) {
        // Only admins can delete other users
        if (currentUser.role !== 'admin') {
          return {
            success: false,
            message: 'Unauthorized to delete this profile',
            errors: ['You can only delete your own profile']
          };
        }
      }

      // Soft delete - mark as inactive
      mockUsers = mockUsers.map(user => 
        user.id === request.userId 
          ? { ...user, isActive: false }
          : user
      );

      // If deleting own account, clear current user
      if (request.userId === currentUser.id) {
        // In a real app, this would clear authentication tokens
        console.log('User deleted their own account - would redirect to login');
      }

      return {
        success: true,
        message: 'Profile deleted successfully'
      };

    } catch (error) {
      console.error('Profile deletion error:', error);
      return {
        success: false,
        message: 'Failed to delete profile',
        errors: ['An unexpected error occurred during deletion']
      };
    }
  }

  /**
   * Check if current user can delete a specific profile
   */
  canDeleteProfile(targetUserId: string): boolean {
    // User can delete their own profile
    if (targetUserId === currentUser.id) {
      return true;
    }
    
    // Admins can delete other profiles
    return currentUser.role === 'admin';
  }

  /**
   * Get user by ID (for admin functions)
   */
  async getUserById(userId: string): Promise<ApiResponse<UserProfile>> {
    await this.delay(300);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        errors: ['Invalid user ID']
      };
    }

    return {
      success: true,
      data: user,
      message: 'User retrieved successfully'
    };
  }
}

// Export singleton instance
export const userApiService = new UserApiService();
export default userApiService;