
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'suspended';
  createdAt: string;
  totalPurchases: number;
}

const UserManagement = () => {
  const { admin } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-15',
      totalPurchases: 150,
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-02-20',
      totalPurchases: 0,
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as const,
    password: '',
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      totalPurchases: 0,
    };
    
    setUsers([...users, newUser]);
    setFormData({ name: '', email: '', role: 'user', password: '' });
    setShowCreateForm(false);
  };

  const handleStatusChange = (id: string, newStatus: 'active' | 'suspended') => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      user: 'bg-blue-500',
      admin: 'bg-green-500',
      super_admin: 'bg-purple-500',
    };
    return <Badge className={variants[role as keyof typeof variants]}>{role}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-500',
      suspended: 'bg-red-500',
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const canCreateAdmin = admin?.role === 'super_admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold luxury-text">Gestión de Usuarios</h2>
        {canCreateAdmin && (
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="luxury-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Administrador
          </Button>
        )}
      </div>

      {showCreateForm && canCreateAdmin && (
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Crear Nuevo Administrador
            </CardTitle>
            <CardDescription>
              Solo los super administradores pueden crear otros administradores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select value={formData.role} onValueChange={(value: 'user' | 'admin') => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Usuario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Contraseña Temporal</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="luxury-button">
                  Crear Administrador
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>
            Gestiona usuarios y administradores de la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Compras</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>${user.totalPurchases}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                      >
                        {user.status === 'active' ? 'Suspender' : 'Activar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
