import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/db';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, name: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from DB
  useEffect(() => {
    // DB is assumed initialized by index.tsx before this component mounts
    try {
      const sessionUser = db.getSession();
      if (sessionUser) {
        setUser(sessionUser);
      }
    } catch (e) {
      console.error("Error loading session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string, password: string) => {
    const loggedInUser = db.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const register = (email: string, name: string, password: string) => {
    const success = db.createUser(email, name, password);
    if (success) {
      // Auto login after register
      const loggedInUser = db.login(email, password);
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    db.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};