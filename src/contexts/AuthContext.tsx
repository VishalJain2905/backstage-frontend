import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApiService, type User } from '../services/authApi';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ needsWalletConnection?: boolean }>;
  register: (data: { email: string; username: string; password: string; walletAddress?: string }) => Promise<void>;
  walletLogin: (walletAddress: string, signature: string, message: string) => Promise<{ needsRegistration?: boolean; walletAddress?: string }>;
  completeWalletRegistration: (data: { walletAddress: string; email: string; username: string; password: string }) => Promise<void>;
  connectWallet: (walletAddress: string, signature: string, message: string) => Promise<void>;
  updateProfile: (data: { username?: string; profilePicture?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      if (authApiService.isAuthenticated()) {
        try {
          const userData = await authApiService.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          authApiService.logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApiService.login({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      return { needsWalletConnection: response.needsWalletConnection };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; username: string; password: string; walletAddress?: string }) => {
    setIsLoading(true);
    try {
      const response = await authApiService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const walletLogin = async (walletAddress: string, signature: string, message: string) => {
    setIsLoading(true);
    try {
      const response = await authApiService.walletLogin({ walletAddress, signature, message });
      
      if (response.needsRegistration) {
        return { needsRegistration: true, walletAddress: response.walletAddress };
      }
      
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      
      return {};
    } catch (error) {
      console.error('Wallet login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeWalletRegistration = async (data: { walletAddress: string; email: string; username: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await authApiService.completeWalletRegistration(data);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Wallet registration completion error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (walletAddress: string, signature: string, message: string) => {
    setIsLoading(true);
    try {
      const response = await authApiService.connectWallet({ walletAddress, signature, message });
      setUser(response.user);
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { username?: string; profilePicture?: string }) => {
    try {
      const updatedUser = await authApiService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!isAuthenticated) return;
    
    try {
      const userData = await authApiService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const logout = () => {
    authApiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    walletLogin,
    completeWalletRegistration,
    connectWallet,
    updateProfile,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
