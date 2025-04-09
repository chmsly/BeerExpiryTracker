'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService, { UserData } from '@/services/auth.service';

// Define the context type
export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  currentUser: UserData | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: UserData) => Promise<boolean>;
}

// Create the context with a default empty value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  currentUser: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUser: async () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = () => {
      const user = authService.getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ username, password });
      setIsAuthenticated(true);
      setCurrentUser(authService.getCurrentUser());
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register({ username, email, password });
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.push('/auth/login');
  };

  // Update user function
  const updateUser = async (userData: UserData): Promise<boolean> => {
    try {
      // In a real app, you would call an API to update the user
      // For now, we'll just update the local state
      setCurrentUser(userData);
      
      // Update the user in local storage
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  const value = {
    isAuthenticated,
    loading,
    currentUser,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 