import apiService from './axiosService';

// Define response types
interface UserResponse {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  user: UserResponse;
  token: string;
}

// User API service
export const userApiService = {
  // Login user
  login: (email: string, password: string) => {
    return apiService.post<AuthResponse>('/auth/login', { email, password });
  },

  // Register user
  register: (name: string, email: string, password: string, confirm_password: string) => {
    return apiService.post<AuthResponse>('/auth/register', {
      'username':name,
      'email':email,
      'password':password,
      'confirmpassword': confirm_password,
    });
  },

  // Get current user profile
  getCurrentUser: () => {
    return apiService.get<UserResponse>('/user/profile');
  },

  // Update user profile
  updateProfile: (userData: Partial<UserResponse>) => {
    return apiService.patch<UserResponse>('/user/profile', userData);
  },

  // Logout user
  logout: () => {
    return apiService.post('/auth/logout');
  },
};

export default userApiService;