import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Search, Download, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Purchase } from "@/lib/api/purchase";
import { useAdminAuth } from "@/contexts/useAdminAuth"; // 👈 AGREGA ESTA LÍNEA

const TransactionViewer = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    paymentMethod: "all",
    dateFrom: "",
    dateTo: "",
  });

  const { token } = useAdminAuth(); // 👈 AGREGA ESTO

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery<Purchase[]>({
    queryKey: ["transactions", token],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/api/purchase", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(
          "⚠️ Error en fetch de transacciones:",
          response.status,
          text
        );
        throw new Error("Error al cargar transacciones");
      }

      return response.json();
    },
    enabled: !!token,
    retry: false,
  });

  if (isLoading) {
    return (
      <p className="text-center text-gray-500">Cargando transacciones...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500">Error al cargar transacciones.</p>
    );
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch =
      transaction.userId.name
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      transaction.transactionId
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    const statusMatch =
      filters.status === "all" || transaction.status === filters.status;

    const paymentMatch =
      filters.paymentMethod === "all" ||
      transaction.paymentMethod === filters.paymentMethod;

    const dateFromMatch =
      !filters.dateFrom ||
      new Date(transaction.createdAt) >= new Date(filters.dateFrom);

    const dateToMatch =
      !filters.dateTo ||
      new Date(transaction.createdAt) <= new Date(filters.dateTo + "T23:59:59");

    return (
      searchMatch && statusMatch && paymentMatch && dateFromMatch && dateToMatch
    );
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-500",
      pending: "bg-yellow-500",
      failed: "bg-red-500",
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      card: "bg-blue-500",
      transfer: "bg-purple-500",
      cash: "bg-gray-500",
    };
    return (
      <Badge className={variants[method as keyof typeof variants]}>
        {method}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalRevenue = filteredTransactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExport = () => {
    const csvContent = [
      [
        "ID",
        "Usuario",
        "Sorteo",
        "Monto",
        "Boletos",
        "Estado",
        "Método",
        "Fecha",
      ].join(","),
      ...filteredTransactions.map((t) =>
        [
          t.transactionId,
          t.userId.name,
          t.raffleId.title,
          t.amount,
          t.ticketCount,
          t.status,
          t.paymentMethod,
          formatDate(t.createdAt),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transacciones.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold luxury-text">Transacciones</h2>
        <Button onClick={handleExport} className="luxury-button">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="luxury-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold luxury-text">
              ${totalRevenue}
            </div>
            <div className="text-sm text-gray-600">Ingresos Totales</div>
          </CardContent>
        </Card>
        <Card className="luxury-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold luxury-text">
              {
                filteredTransactions.filter((t) => t.status === "completed")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Completadas</div>
          </CardContent>
        </Card>
        <Card className="luxury-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold luxury-text">
              {
                filteredTransactions.filter((t) => t.status === "pending")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </CardContent>
        </Card>
        <Card className="luxury-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold luxury-text">
              {filteredTransactions.reduce((sum, t) => sum + t.ticketCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Boletos Vendidos</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Usuario o ID..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment">Método de Pago</Label>
              <Select
                value={filters.paymentMethod}
                onValueChange={(value) =>
                  setFilters({ ...filters, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="card">Tarjeta</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                  <SelectItem value="cash">Efectivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFrom">Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="luxury-card">
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transacciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Sorteo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Boletos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.transactionId}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.userId.name}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {transaction.raffleId.title}
                  </TableCell>
                  <TableCell className="font-bold">
                    ${transaction.amount}
                  </TableCell>
                  <TableCell>{transaction.ticketCount}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>
                    {getPaymentMethodBadge(transaction.paymentMethod)}
                  </TableCell>
                  <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionViewer;
