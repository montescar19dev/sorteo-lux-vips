
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin, AdminAuthContextType } from './adminTypes';


const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export { AdminAuthContext }; // al final del archivo


export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedAdmin = localStorage.getItem('adminData');
    
    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) return false;

    const data = await response.json();

    if (data.token && data.admin) {
      setAdmin(data.admin);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('adminData', JSON.stringify(data.admin));
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
    localStorage.removeItem('token');
    localStorage.removeItem('adminData');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isLoading, token }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
