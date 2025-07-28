import React, { useState } from "react";
import { useAdminAuth } from "@/contexts/useAdminAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Plus,
  Users,
  Trophy,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import RaffleManagement from "@/components/RaffleManagement";
import UserManagement from "@/components/UserManagement";
import TransactionViewer from "@/components/TransactionViewer";
import PurchaseManagement from "@/components/PurchaseManagement";
import { usePurchases } from "@/api/usePurchases";
import { Purchase } from "@/types/Purchase";

const AdminDashboard = () => {
  const { admin, logout } = useAdminAuth();
  const { token } = useAdminAuth();

  const purchaseQuery = usePurchases(token);
  const purchases = purchaseQuery?.data ?? [];
  const isLoading = purchaseQuery?.isLoading;
  const isError = purchaseQuery?.isError;

  // ✅ Esto va después de los hooks, no antes
  const [activeTab, setActiveTab] = useState("raffles");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272727] to-[#1a1a1a]">
      {/* Header */}
      <div className="bg-black/20 border-b border-[#D4AA7D]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold luxury-text">
                Panel de Administración
              </h1>
              <p className="text-gray-400">Bienvenido/a, {admin?.name}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#D4AA7D]/30 hover:bg-[#D4AA7D]/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="raffles" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Sorteos
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Compras
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>

            {/*
            <TabsTrigger
              value="transactions"
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Transacciones
            </TabsTrigger>
            */}
            
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="raffles">
            <RaffleManagement />
          </TabsContent>

          <TabsContent value="purchases">
            <PurchaseManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          {/* Seccion de Transacciones */}
          {/* <TabsContent value="transactions">
            <TransactionViewer />
          </TabsContent> */}

          <TabsContent value="stats">
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="luxury-text">
                  Estadísticas Generales
                </CardTitle>
                <CardDescription>
                  Métricas y análisis de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold luxury-text mb-2">
                      12
                    </div>
                    <div className="text-gray-600">Sorteos Activos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold luxury-text mb-2">
                      1,234
                    </div>
                    <div className="text-gray-600">Usuarios Registrados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold luxury-text mb-2">
                      $45,678
                    </div>
                    <div className="text-gray-600">Ingresos Totales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
