
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Admin {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  name: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminData');
    
    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - replace with actual authentication
      const mockResponse = await new Promise<{ success: boolean; admin?: Admin; token?: string }>((resolve) => {
        setTimeout(() => {
          if (email === 'admin@sorteovip.com' && password === 'admin123') {
            resolve({
              success: true,
              admin: {
                id: '1',
                email: 'admin@sorteovip.com',
                role: 'super_admin',
                name: 'Super Admin'
              },
              token: 'mock-jwt-token-' + Date.now()
            });
          } else {
            resolve({ success: false });
          }
        }, 1000);
      });

      if (mockResponse.success && mockResponse.admin && mockResponse.token) {
        setAdmin(mockResponse.admin);
        setToken(mockResponse.token);
        localStorage.setItem('adminToken', mockResponse.token);
        localStorage.setItem('adminData', JSON.stringify(mockResponse.admin));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isLoading, token }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
