export interface User {
  _id: string;
  name: string; 
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
  status: 'active' | 'inactive'; 
  createdAt: string;
  password?: string;
  totalPurchases: number;
}
