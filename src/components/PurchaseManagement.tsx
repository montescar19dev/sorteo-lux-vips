
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Purchase {
  id: string;
  fullName: string;
  idType: 'V' | 'E';
  idNumber: string;
  phone: string;
  email: string;
  raffleTitle: string;
  ticketNumbers: string[];
  amount: number;
  reference: string;
  screenshot: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

const PurchaseManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  
  // Mock data - in real app this would come from backend
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: '1',
      fullName: 'Juan Pérez',
      idType: 'V',
      idNumber: '12345678',
      phone: '04121234567',
      email: 'juan@example.com',
      raffleTitle: 'Toyota Land Cruiser Prado 2024',
      ticketNumbers: ['1234', '5678'],
      amount: 100,
      reference: 'REF123456789',
      screenshot: 'screenshot1.jpg',
      status: 'pending',
      createdAt: '2024-01-15 10:30:00',
    },
    {
      id: '2',
      fullName: 'María García',
      idType: 'V',
      idNumber: '87654321',
      phone: '04167891234',
      email: 'maria@example.com',
      raffleTitle: 'iPhone 15 Pro Max',
      ticketNumbers: ['9876'],
      amount: 25,
      reference: 'REF987654321',
      screenshot: 'screenshot2.jpg',
      status: 'verified',
      createdAt: '2024-01-14 15:45:00',
    },
  ]);

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.phone.includes(searchTerm) ||
                         purchase.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleVerifyPurchase = (id: string) => {
    setPurchases(purchases.map(purchase => 
      purchase.id === id ? { ...purchase, status: 'verified' as const } : purchase
    ));
    toast({
      title: "Compra verificada",
      description: "La compra ha sido verificada exitosamente.",
    });
  };

  const handleRejectPurchase = (id: string) => {
    setPurchases(purchases.map(purchase => 
      purchase.id === id ? { ...purchase, status: 'rejected' as const } : purchase
    ));
    toast({
      title: "Compra rechazada",
      description: "La compra ha sido rechazada y los números devueltos al pool.",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-500',
      verified: 'bg-green-500',
      rejected: 'bg-red-500',
    };
    const labels = {
      pending: 'Pendiente',
      verified: 'Verificada',
      rejected: 'Rechazada',
    };
    return <Badge className={variants[status as keyof typeof variants]}>
      {labels[status as keyof typeof labels]}
    </Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold luxury-text">Gestión de Compras</h2>
        <div className="flex gap-2">
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
            onChange={(e) => setStatusFilter(e.target.value as any)}
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
                {purchases.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
          </CardContent>
        </Card>
        <Card className="luxury-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {purchases.filter(p => p.status === 'verified').length}
              </div>
              <div className="text-sm text-gray-600">Verificadas</div>
            </div>
          </CardContent>
        </Card>
        <Card className="luxury-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {purchases.filter(p => p.status === 'rejected').length}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Sorteo</TableHead>
                <TableHead>Números</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{purchase.fullName}</div>
                      <div className="text-sm text-gray-600">
                        {purchase.idType}-{purchase.idNumber}
                      </div>
                      <div className="text-sm text-gray-600">{purchase.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{purchase.raffleTitle}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {purchase.ticketNumbers.map((ticket, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ticket}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>Bs. {purchase.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                  <TableCell>{purchase.createdAt}</TableCell>
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
                          {selectedPurchase && (
                            <div className="space-y-4">
                              <div>
                                <Label>Referencia de Pago</Label>
                                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                                  {selectedPurchase.reference}
                                </p>
                              </div>
                              <div>
                                <Label>Comprobante</Label>
                                <div className="bg-gray-100 p-4 rounded text-center">
                                  <p className="text-sm text-gray-600">
                                    Archivo: {selectedPurchase.screenshot}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    (En implementación real se mostraría la imagen)
                                  </p>
                                </div>
                              </div>
                              <div>
                                <Label>Números Asignados</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedPurchase.ticketNumbers.map((ticket, index) => (
                                    <Badge key={index} className="bg-blue-500">
                                      {ticket}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {purchase.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleVerifyPurchase(purchase.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleRejectPurchase(purchase.id)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseManagement;
