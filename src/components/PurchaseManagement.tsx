import React, { useState } from "react";
import { Purchase } from "@/types/Purchase";
import { useAdminAuth } from "@/contexts/useAdminAuth";
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
import { updatePurchaseStatus, usePurchases } from "@/api/usePurchases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const [searchType, setSearchType] = useState("all"); // all | ticket | name | phone | reference

  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "verified" | "rejected"
  >("all");

  const [raffleOptions, setRaffleOptions] = useState<string[]>([]);
  const [selectedRaffles, setSelectedRaffles] = useState<string[]>([]);

  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );

  const { token } = useAdminAuth();
  const purchaseQuery = usePurchases(token);

  const queryClient = useQueryClient();

  const { mutate: changeStatus } = useMutation({
    mutationFn: (params: {
      id: string;
      status: "pending" | "verified" | "rejected";
    }) => updatePurchaseStatus(params.id, params.status, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases", token] }); // 🔄 Refresca la tabla
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la compra.",
        variant: "destructive",
      });
    },
  });

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const isLoading = purchaseQuery?.isLoading;
  const isError = purchaseQuery?.isError;

  // Sync purchases state with fetched data
  React.useEffect(() => {
    if (purchaseQuery?.data) {
      setPurchases(purchaseQuery.data);

      // Extraer títulos únicos de rifas
      const uniqueTitles = [
        ...new Set(
          purchaseQuery.data
            .map((p) =>
              typeof p.raffleId === "object" && p.raffleId !== null
                ? p.raffleId.title
                : ""
            )
            .filter((title) => title !== "")
        ),
      ];
      setRaffleOptions(uniqueTitles);
    }
  }, [purchaseQuery?.data]);

  if (isLoading)
    return <p className="text-sm text-gray-400">Cargando compras...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Error al cargar las compras.</p>;

  const filteredPurchases = purchases.filter((purchase) => {
    const term = searchTerm.toLowerCase();

    const raffleTitle =
      typeof purchase.raffleId === "object" && purchase.raffleId !== null
        ? purchase.raffleId.title
        : "";

    const matchesRaffle =
      selectedRaffles.length === 0 || selectedRaffles.includes(raffleTitle);

    const matchesSearch = (() => {
      const term = searchTerm.toLowerCase();

      switch (searchType) {
        case "ticket":
          return purchase.ticketNumbers.some((n) => n.toString() === term);

        case "phone":
          return (purchase.phoneNumber || "").toLowerCase().includes(term);

        case "reference":
          return (purchase.transactionId || "").toLowerCase().includes(term);

        case "name":
          return (purchase.fullName || "").toLowerCase().includes(term);

        case "all":
        default:
          return (
            (purchase.fullName || "").toLowerCase().includes(term) ||
            (purchase.phoneNumber || "").toLowerCase().includes(term) ||
            (purchase.transactionId || "").toLowerCase().includes(term) ||
            purchase.ticketNumbers.some((n) => n.toString().includes(term))
          );
      }
    })();

    const matchesStatus =
      statusFilter === "all" || purchase.status === statusFilter;

    return matchesRaffle && matchesSearch && matchesStatus;
  });

  const handleVerifyPurchase = (id: string) => {
    changeStatus({ id, status: "verified" });
    toast({
      title: "Compra verificada",
      description: "La compra ha sido verificada exitosamente.",
    });
  };

  const handleRejectPurchase = (id: string) => {
    changeStatus({ id, status: "rejected" });
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
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border px-2 py-2 rounded-md w-48"
            >
              <option value="all">Todos</option>
              <option value="ticket">N° de Boleto</option>
              <option value="name">Nombre</option>
              <option value="phone">Teléfono</option>
              <option value="reference">Referencia</option>
            </select>
          </div>

          <select
            value={selectedRaffles[0] || "all"}
            onChange={(e) =>
              setSelectedRaffles(
                e.target.value === "all" ? [] : [e.target.value]
              )
            }
            className="border px-2 py-2 rounded-md w-48"
          >
            <option value="all">Todas</option>
            {raffleOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>

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
                    {/* 2) Columna Sorteo: si usas populate, purchase.raffleId es el objeto */}
                    <TableCell>
                      {typeof purchase.raffleId === "object" &&
                      purchase.raffleId !== null
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
                          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-black text-white">
                            <DialogHeader>
                              <DialogTitle>Detalles de la Compra</DialogTitle>
                            </DialogHeader>
                            {selectedPurchase?._id === purchase._id && (
                              <div className="space-y-4">
                                {/* Referencia de pago */}
                                <div>
                                  <Label>Referencia de Pago</Label>
                                  <p className="font-mono text-sm bg-gray-900 p-2 rounded">
                                    {selectedPurchase.transactionId}
                                  </p>
                                </div>
                                {/* Comprobante (imagen) */}
                                <div>
                                  <Label>Comprobante</Label>
                                  <div className="bg-gray-900 p-4 rounded text-center">
                                    <img
                                      src={selectedPurchase.receiptUrl}
                                      alt="Comprobante"
                                      className="max-w-full h-auto mx-auto"
                                    />
                                  </div>
                                </div>

                                {/* Nombre del comprador */}
                                <div>
                                  <Label>Nombre del Comprador</Label>
                                  <p className="text-sm bg-gray-900 p-2 rounded">
                                    {selectedPurchase.fullName}
                                  </p>
                                </div>

                                {/* Teléfono del comprador */}
                                <div>
                                  <Label>Teléfono</Label>
                                  <a
                                    href={`https://wa.me/58${selectedPurchase.phoneNumber.replace(
                                      /^0/,
                                      ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm bg-gray-900 p-2 rounded block text-green-600 hover:underline"
                                  >
                                    {selectedPurchase.phoneNumber}
                                  </a>
                                </div>

                                {/* Números (sólo en el modal) */}
                                <div>
                                  <Label>Números Asignados</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedPurchase.ticketNumbers.map(
                                      (t, i) => (
                                        <Badge
                                          key={i}
                                          className="bg-gradient-to-r from-[#FFD700] to-[#e3ab02] text-[#1D1D1D]"

                                        >
                                          {t}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                                {/* ID de la compra */}
                                <div>
                                  <Label>ID de la Compra</Label>
                                  <p className="font-mono text-xs bg-gray-900 p-2 rounded break-all">
                                    {selectedPurchase._id}
                                  </p>
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
