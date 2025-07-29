import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import userService, { User, LoginCredentials, RegisterData, UpdateProfileData } from '../services/userService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (profileData: UpdateProfileData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      console.log('Loading user, initial token:', token);
      if (token) {
        try {
          const userData = await userService.getCurrentUser();
          console.log('User loaded successfully:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err: any) {
          console.error('Load user failed:', err.message, err.response?.data);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError('Session expired. Please login again.');
        }
      } else {
        console.log('No token found, skipping user load');
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    console.log('Attempting login with credentials:', credentials);
    try {
      setLoading(true);
      setError(null);
      const { token: authToken, user: userData } = await userService.login(credentials);
      console.log('Login successful, received token:', authToken, 'user:', userData);
      localStorage.setItem('token', authToken);
      console.log('Token stored in localStorage:', localStorage.getItem('token'));
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Login error:', err.message, err.response?.data);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const { token: authToken, user: newUser } = await userService.register(userData);
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(newUser);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Register error:', err.message, err.response?.data);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData: UpdateProfileData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.updateProfile(profileData);
      setUser(updatedUser);
    } catch (err: any) {
      console.error('Update profile error:', err.message, err.response?.data);
      setError(err.response?.data?.message || 'Profile update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        updateProfile,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;