
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const defaultContext: AuthContextType = {
  currentUser: null,
  loading: true,
  signIn: async () => {},
  signOut: () => {},
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage on mount
    const storedUser = localStorage.getItem('sports-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        console.log('User loaded from localStorage:', parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('sports-user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      // In a real app, this would validate against a backend
      // For demo purposes, we'll accept any email/password with basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Create a mock user based on the email
      const user: User = {
        id: btoa(email), // Base64 encode email as mock ID
        email,
        name: email.split('@')[0],
      };
      
      // Store user in localStorage
      localStorage.setItem('sports-user', JSON.stringify(user));
      setCurrentUser(user);
      
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('sports-user');
    setCurrentUser(null);
    toast.info('You have been signed out');
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
