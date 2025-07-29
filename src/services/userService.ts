import api from './api';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  city?: string;
  photo?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  city?: string;
  photo?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  bio?: string;
  city?: string;
  photo?: string;
}

const userService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data.data;
  },

  updateProfile: async (profileData: UpdateProfileData): Promise<User> => {
    const response = await api.put('/users/me', profileData);
    return response.data.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  },
};

export default userService;