
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Pause, Play, Award, Trash2 } from 'lucide-react';

interface Raffle {
  id: string;
  title: string;
  description: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  status: 'active' | 'paused' | 'ended';
  endDate: string;
  winner?: string;
}

const RaffleManagement = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([
    {
      id: '1',
      title: 'Toyota Land Cruiser Prado 2024',
      description: 'SUV de lujo completamente equipado',
      ticketPrice: 50,
      totalTickets: 1000,
      soldTickets: 750,
      status: 'active',
      endDate: '2024-12-31',
    },
    {
      id: '2',
      title: 'iPhone 15 Pro Max',
      description: 'Último modelo de Apple',
      ticketPrice: 25,
      totalTickets: 500,
      soldTickets: 450,
      status: 'active',
      endDate: '2024-12-25',
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticketPrice: '',
    totalTickets: '',
    endDate: '',
  });

  const handleStatusChange = (id: string, newStatus: 'active' | 'paused') => {
    setRaffles(raffles.map(raffle => 
      raffle.id === id ? { ...raffle, status: newStatus } : raffle
    ));
  };

  const handleAssignWinner = (id: string) => {
    const winner = prompt('Ingresa el ID del usuario ganador:');
    if (winner) {
      setRaffles(raffles.map(raffle => 
        raffle.id === id ? { ...raffle, winner, status: 'ended' as const } : raffle
      ));
    }
  };

  const handleCreateRaffle = (e: React.FormEvent) => {
    e.preventDefault();
    const newRaffle: Raffle = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      ticketPrice: Number(formData.ticketPrice),
      totalTickets: Number(formData.totalTickets),
      soldTickets: 0,
      status: 'active',
      endDate: formData.endDate,
    };
    
    setRaffles([...raffles, newRaffle]);
    setFormData({ title: '', description: '', ticketPrice: '', totalTickets: '', endDate: '' });
    setShowCreateForm(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-500',
      paused: 'bg-yellow-500',
      ended: 'bg-gray-500',
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold luxury-text">Gestión de Sorteos</h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="luxury-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Sorteo
        </Button>
      </div>

      {showCreateForm && (
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle>Crear Nuevo Sorteo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRaffle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ticketPrice">Precio del Boleto</Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="totalTickets">Total de Boletos</Label>
                  <Input
                    id="totalTickets"
                    type="number"
                    value={formData.totalTickets}
                    onChange={(e) => setFormData({...formData, totalTickets: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fecha de Finalización</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="luxury-button">
                  Crear Sorteo
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
          <CardTitle>Sorteos Existentes</CardTitle>
          <CardDescription>
            Gestiona todos los sorteos de la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Boletos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Final</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {raffles.map((raffle) => (
                <TableRow key={raffle.id}>
                  <TableCell className="font-medium">{raffle.title}</TableCell>
                  <TableCell>${raffle.ticketPrice}</TableCell>
                  <TableCell>{raffle.soldTickets}/{raffle.totalTickets}</TableCell>
                  <TableCell>{getStatusBadge(raffle.status)}</TableCell>
                  <TableCell>{raffle.endDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(raffle.id, raffle.status === 'active' ? 'paused' : 'active')}
                      >
                        {raffle.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAssignWinner(raffle.id)}
                        disabled={raffle.status === 'ended'}
                      >
                        <Award className="h-4 w-4" />
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

export default RaffleManagement;
