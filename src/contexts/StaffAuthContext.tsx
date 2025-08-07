import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Staff {
  id: string;
  email: string;
  name: string;
  role: 'staff';
}

interface StaffAuthContextType {
  staff: Staff | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);
export { StaffAuthContext };

export const StaffAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('staffToken');
    const storedStaff = localStorage.getItem('staffData');

    if (storedToken && storedStaff) {
      setToken(storedToken);
      setStaff(JSON.parse(storedStaff));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) return false;

      const data = await response.json();

      if (data.token && data.staff) {
        setStaff(data.staff);
        setToken(data.token);
        localStorage.setItem('staffToken', data.token);
        localStorage.setItem('staffData', JSON.stringify(data.staff));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Staff login error:', error);
      return false;
    }
  };

  const logout = () => {
    setStaff(null);
    setToken(null);
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffData');
  };

  return (
    <StaffAuthContext.Provider value={{ staff, login, logout, isLoading, token }}>
      {children}
    </StaffAuthContext.Provider>
  );
};
