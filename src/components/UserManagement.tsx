import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/useAdminAuth";
import { Plus, Edit, Trash2, Shield } from "lucide-react";
import { useUsers, useCreateUser, useToggleUserStatus } from "@/api/useUsers";
import type { User } from "@/types/User";

type Role = "super_admin" | "admin" | "staff";

const UserManagement = () => {
  const { admin, token } = useAdminAuth();
  const { data: users = [], isLoading } = useUsers(token);

  const createUser = useCreateUser(token);
  const toggleStatus = useToggleUserStatus(token);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "staff" as Role,
    password: "",
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();

    createUser.mutate(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
      {
        onSuccess: () => {
          setFormData({ name: "", email: "", role: "staff", password: "" });
          setShowCreateForm(false);
        },
      }
    );
  };

  const handleStatusChange = (
    id: string,
    newStatus: "active" | "suspended"
  ) => {
    toggleStatus.mutate({ userId: id });
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      staff: "bg-blue-500",
      admin: "bg-green-500",
      super_admin: "bg-purple-500",
    };
    return (
      <Badge className={variants[role as keyof typeof variants]}>{role}</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-500",
      suspended: "bg-red-500",
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const canCreateAdmin = admin?.role === "super_admin";

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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value as Role })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Empleado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">Contraseña Temporal</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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
                <TableRow key={user._id}>
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
                        onClick={() =>
                          handleStatusChange(
                            user._id,
                            user.status === "active" ? "suspended" : "active"
                          )
                        }
                      >
                        {user.status === "active" ? "Suspender" : "Activar"}
                      </Button>
                      <Button size="sm" variant="outline">
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
