import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  employeeId: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (employeeId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('safety_monitor_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (employeeId: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    if (employeeId && password.length >= 4) {
      const userData: User = {
        employeeId,
        name: `Operator ${employeeId}`,
        role: 'Safety Monitor',
      };
      setUser(userData);
      localStorage.setItem('safety_monitor_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('safety_monitor_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
