// TypeScript interfaces for user profile management

export interface UserProfile {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  createdAt: string;
  role: 'manufacturer' | 'distributor' | 'plant_operator' | 'auditor' | 'admin';
  isActive: boolean;
}

export interface DeleteProfileRequest {
  userId: string;
  reason?: string;
  confirmPassword?: string;
}

export interface DeleteProfileResponse {
  success: boolean;
  message: string;
  errors?: string[];
}