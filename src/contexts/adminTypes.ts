export interface Admin {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  name: string;
}

export interface AdminAuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}
