import React, { useState } from "react";
import { Purchase } from "@/types/Purchase";
import { useAdminAuth } from "@/contexts/useAdminAuth";
import { usePurchases } from "@/api/usePurchases";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Formatea ISO → "dd/mm/yyyy hh:mm"
const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} ${time}`;
};

const PurchaseManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "verified" | "rejected"
  >("all");
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );

  const { token } = useAdminAuth();
  const purchaseQuery = usePurchases(token);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const isLoading = purchaseQuery?.isLoading;
  const isError = purchaseQuery?.isError;

  // Sync purchases state with fetched data
  React.useEffect(() => {
    if (purchaseQuery?.data) {
      setPurchases(purchaseQuery.data);
    }
  }, [purchaseQuery?.data]);

  if (isLoading)
    return <p className="text-sm text-gray-400">Cargando compras...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Error al cargar las compras.</p>;

  const filteredPurchases = purchases.filter((purchase) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      // si raffleId es objeto, usa title; si es string, usa el string; si es falsy, usa ""
      (
        typeof purchase.raffleId === "object" && purchase.raffleId !== null
          ? purchase.raffleId.title
          : typeof purchase.raffleId === "string"
          ? purchase.raffleId
          : ""
      )
        .toLowerCase()
        .includes(term) ||
      (purchase.fullName || "").toLowerCase().includes(term) ||
      (purchase.phoneNumber || "").toLowerCase().includes(term) ||
      (purchase.transactionId || "").toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "all" || purchase.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleVerifyPurchase = (id: string) => {
    setPurchases((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, status: "verified" as const } : p
      )
    );
    toast({
      title: "Compra verificada",
      description: "La compra ha sido verificada exitosamente.",
    });
  };

  const handleRejectPurchase = (id: string) => {
    setPurchases((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, status: "rejected" as const } : p
      )
    );
    toast({
      title: "Compra rechazada",
      description:
        "La compra ha sido rechazada y los números devueltos al pool.",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-500",
      verified: "bg-green-500",
      rejected: "bg-red-500",
    };
    const labels = {
      pending: "Pendiente",
      verified: "Verificada",
      rejected: "Rechazada",
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <h2 className="text-2xl font-bold luxury-text">Gestión de Compras</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, teléfono o referencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "pending" | "verified" | "rejected"
              )
            }
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="verified">Verificadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="luxury-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {purchases.filter((p) => p.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
          </CardContent>
        </Card>
        <Card className="luxury-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {purchases.filter((p) => p.status === "verified").length}
              </div>
              <div className="text-sm text-gray-600">Verificadas</div>
            </div>
          </CardContent>
        </Card>
        <Card className="luxury-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {purchases.filter((p) => p.status === "rejected").length}
              </div>
              <div className="text-sm text-gray-600">Rechazadas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle>Lista de Compras</CardTitle>
          <CardDescription>
            Gestiona las compras y verifica los pagos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Sorteo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase._id}>
                    {/* 1) Columna ID */}
                    <TableCell className="font-mono text-sm">
                      {purchase._id}
                    </TableCell>

                    {/* 2) Columna Sorteo: si usas populate, purchase.raffleId es el objeto */}
                    <TableCell>
                      {typeof purchase.raffleId === "object" && purchase.raffleId !== null
                        ? purchase.raffleId.title
                        : "-"}
                    </TableCell>

                    {/* 3) Columna Monto */}
                    <TableCell>Bs. {purchase.amount.toFixed(2)}</TableCell>

                    {/* 4) Columna Estado */}
                    <TableCell>{getStatusBadge(purchase.status)}</TableCell>

                    {/* 5) Columna Fecha, ya formateada */}
                    <TableCell>{formatDateTime(purchase.createdAt)}</TableCell>

                    {/* 6) Acciones */}
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPurchase(purchase)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Detalles de la Compra</DialogTitle>
                            </DialogHeader>
                            {selectedPurchase?._id === purchase._id && (
                              <div className="space-y-4">
                                {/* Referencia de pago */}
                                <div>
                                  <Label>Referencia de Pago</Label>
                                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                                    {selectedPurchase.transactionId}
                                  </p>
                                </div>
                                {/* Comprobante (imagen) */}
                                <div>
                                  <Label>Comprobante</Label>
                                  <div className="bg-gray-100 p-4 rounded text-center">
                                    <img
                                      src={selectedPurchase.receiptUrl}
                                      alt="Comprobante"
                                      className="max-w-full h-auto mx-auto"
                                    />
                                  </div>
                                </div>
                                {/* Números (sólo en el modal) */}
                                <div>
                                  <Label>Números Asignados</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedPurchase.ticketNumbers.map(
                                      (t, i) => (
                                        <Badge
                                          key={i}
                                          className="bg-blue-500 text-white"
                                        >
                                          {t}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Botones Verificar / Rechazar sólo si está pendiente */}
                        {purchase.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleVerifyPurchase(purchase._id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRejectPurchase(purchase._id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseManagement;
