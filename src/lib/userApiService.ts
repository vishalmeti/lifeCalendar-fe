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
    const resp = apiService.post<AuthResponse>('/auth/login', { email, password });
    return resp.then(response => {
      if (response.status === 200) {
        // Store token in local storage
        localStorage.setItem('auth_token', response.data.token);
      }
      return response;
    });
  },

  // Register user
  register: (name: string, email: string, password: string, confirm_password: string) => {
    const resp = apiService.post<AuthResponse>('/auth/register', {
      'username':name,
      'email':email,
      'password':password,
      'confirmpassword': confirm_password,
    });

    return resp.then(response => {
      if (response.status === 200) {
        // Store token in local storage
        localStorage.setItem('auth_token', response.data.token);
      }
      return response;
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