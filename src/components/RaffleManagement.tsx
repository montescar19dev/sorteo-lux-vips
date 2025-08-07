import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Pause, Play, Award, Trash2 } from "lucide-react";
import ReactCrop, { PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Raffle } from "@/types/Raffle";


const RaffleManagement: React.FC = () => {
  // Rifas y formularios
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRaffle, setEditingRaffle] = useState<Raffle | null>(null);

  // Crear/Editar rifa
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ticketPrice: "",
    totalTickets: "",
    minTicketsPerUser: "",
    endDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cropping imagen de premio
  const [rawPrizeImage, setRawPrizeImage] = useState<string | null>(null);
  const [rawPrizeFile, setRawPrizeFile] = useState<File | null>(null);
  const [prizeCrop, setPrizeCrop] = useState<PercentCrop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 80,
    height: Math.round((80 * 9) / 16),
  });
  const prizeImgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal de Ganador
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [winnerRaffleId, setWinnerRaffleId] = useState<string | null>(null);
  const [winnerName, setWinnerName] = useState("");
  const [winnerFile, setWinnerFile] = useState<File | null>(null);

  // Estado de carga de la foto del ganador
  const [isSubmittingWinner, setIsSubmittingWinner] = useState(false);

  // Carga inicial de rifas
  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/raffles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar rifas");
        const data: Raffle[] = await res.json();
        setRaffles(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRaffles();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return d.toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCroppedPrizeBlob = async (): Promise<Blob> => {
    if (!prizeImgRef.current) throw new Error("Imagen no cargada");
    const img = prizeImgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = prizeCrop.width;
    canvas.height = prizeCrop.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      img,
      prizeCrop.x * scaleX,
      prizeCrop.y * scaleY,
      prizeCrop.width * scaleX,
      prizeCrop.height * scaleY,
      0,
      0,
      prizeCrop.width,
      prizeCrop.height
    );
    return new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/jpeg")
    );
  };

  // Crear o editar rifa
  const handleSaveRaffle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("ticketPrice", formData.ticketPrice);
      data.append("totalTickets", formData.totalTickets);
      data.append("minTicketsPerUser", formData.minTicketsPerUser);
      data.append("endDate", formData.endDate);
      if (rawPrizeFile)
        data.append("prizeImage", rawPrizeFile, rawPrizeFile.name);
      const isEdit = Boolean(editingRaffle);
      const res = await fetch(
        isEdit
          ? `http://localhost:5000/api/raffles/${editingRaffle!._id}`
          : "http://localhost:5000/api/raffles",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );
      if (!res.ok) {
        const { message } = await res.json();
        return alert(message);
      }
      const saved = await res.json();
      setRaffles((prev) =>
        isEdit
          ? prev.map((r) => (r._id === saved._id ? saved : r))
          : [...prev, saved]
      );
      setEditingRaffle(null);
      setFormData({
        title: "",
        description: "",
        ticketPrice: "",
        totalTickets: "",
        minTicketsPerUser: "",
        endDate: "",
      });
      setRawPrizeImage(null);
      setRawPrizeFile(null);
      setShowCreateForm(false);
      alert(isEdit ? "Sorteo actualizado" : "Sorteo creado exitosamente");
    } catch (err) {
      console.error(err);
      alert("Error guardando rifa");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pausar / Reanudar
  const handleToggleStatus = async (
    id: string,
    currentStatus: "active" | "paused"
  ) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/raffles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        return alert(message);
      }
      const updated = await res.json();
      setRaffles((prev) => prev.map((r) => (r._id === id ? updated : r)));
    } catch (err) {
      console.error(err);
      alert("Error cambiando estado");
    }
  };

  // Modal Ganador
  const openWinnerForm = (id: string) => {
    setWinnerRaffleId(id);
    setWinnerName("");
    setWinnerFile(null);
    setWinnerModalOpen(true);
  };

  const handleSaveWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!winnerRaffleId) return;
    setIsSubmittingWinner(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("winner", winnerName);
      data.append("status", "ended");
      if (winnerFile) data.append("winnerImage", winnerFile);
      const res = await fetch(
        `http://localhost:5000/api/raffles/${winnerRaffleId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );
      if (!res.ok) {
        const { message } = await res.json();
        return alert(message);
      }
      const updated: Raffle = await res.json();
      setRaffles((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      setWinnerModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error asignando ganador");
    } finally {
      setIsSubmittingWinner(false);
    }
  };

  const getStatusBadge = (s: string) => (
    <Badge
      className={
        {
          active: "bg-green-500",
          paused: "bg-yellow-500",
          ended: "bg-gray-500",
        }[s]
      }
    >
      {s}
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Header y Crear */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold luxury-text">Gestión de Sorteos</h2>
        <Button
          onClick={() => setShowCreateForm((v) => !v)}
          className="luxury-button"
        >
          <Plus className="h-4 w-4 mr-2" /> Crear Sorteo
        </Button>
      </div>

      {/* Formulario Crear/Editar */}
      {showCreateForm && (
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle>
              {editingRaffle ? "Editar Sorteo" : "Crear Nuevo Sorteo"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveRaffle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ticketPrice">Precio</Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    value={formData.ticketPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, ticketPrice: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="totalTickets">Total Boletos</Label>
                  <Input
                    id="totalTickets"
                    type="number"
                    value={formData.totalTickets}
                    onChange={(e) =>
                      setFormData({ ...formData, totalTickets: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minTicketsPerUser">
                    Compra mínima de boletos
                  </Label>
                  <Input
                    id="minTicketsPerUser"
                    type="number"
                    min={1}
                    value={formData.minTicketsPerUser || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minTicketsPerUser: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Fecha Final</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="prizeImage">Imagen del Premio</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setRawPrizeImage(URL.createObjectURL(f));
                      setRawPrizeFile(f);
                    }
                  }}
                  className="mt-1"
                />
                {rawPrizeImage && (
                  <div className="mt-2 mx-auto w-full max-w-md">
                    <ReactCrop
                      crop={prizeCrop}
                      onChange={(_, p) => setPrizeCrop(p)}
                      aspect={16 / 9}
                      ruleOfThirds
                    >
                      <img
                        ref={prizeImgRef}
                        src={rawPrizeImage}
                        alt="Crop preview"
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </ReactCrop>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="luxury-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingRaffle
                      ? "Guardando cambios..."
                      : "Cargando imagen..."
                    : editingRaffle
                    ? "Guardar Cambios"
                    : "Crear Sorteo"}
                </Button>
                <Button
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

      {/* Tabla de Rifas */}
      <Card className="luxury-card">
        <CardHeader>
          <CardTitle>Sorteos Existentes</CardTitle>
          <CardDescription>Gestiona todos los sorteos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Foto</TableHead>
                <TableHead>Boletos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Final</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {raffles.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.ticketPrice}</TableCell>
                  <TableCell>
                    {r.imageUrl ? (
                      <img
                        src={r.imageUrl}
                        alt={r.title}
                        style={{
                          width: 80,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {r.ticketsSold}/{r.totalTickets}
                  </TableCell>
                  <TableCell>{getStatusBadge(r.status)}</TableCell>
                  <TableCell>{formatDate(r.endDate)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* Pausar / Reanudar */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (r.status === "active" || r.status === "paused") {
                            handleToggleStatus(r._id, r.status);
                          }
                        }}
                        disabled={r.status === "ended"}
                      >
                        {r.status === "active" ? <Pause /> : <Play />}
                      </Button>
                      {/* Asignar ganador */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openWinnerForm(r._id)}
                        disabled={!(r.status === "ended" && !r.winner)}
                      >
                        {r.winner ? `🏆 ${r.winner}` : <Award />}
                      </Button>
                      {/* Editar */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingRaffle(r);
                          setFormData({
                            title: r.title,
                            description: r.description,
                            ticketPrice: String(r.ticketPrice),
                            totalTickets: String(r.totalTickets),
                            minTicketsPerUser: String(
                              r.minTicketsPerUser || ""
                            ),
                            endDate: new Date(r.endDate)
                              .toISOString()
                              .slice(0, 10),
                          });
                          setRawPrizeImage(r.imageUrl || null);
                          setShowCreateForm(true);
                        }}
                      >
                        <Edit />
                      </Button>
                      {/* Eliminar */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          const pwd = prompt(
                            "Contraseña para borrar este sorteo:"
                          );
                          if (!pwd) return;
                          const token = localStorage.getItem("token");
                          const res = await fetch(
                            `http://localhost:5000/api/raffles/${r._id}`,
                            {
                              method: "DELETE",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ password: pwd }),
                            }
                          );
                          if (!res.ok) {
                            const { message } = await res.json();
                            alert(`Error: ${message}`);
                          } else {
                            setRaffles((prev) =>
                              prev.filter((x) => x._id !== r._id)
                            );
                            alert("Sorteo eliminado");
                          }
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Asignar Ganador */}
      {winnerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl mb-4">Asignar Ganador</h3>
            <form onSubmit={handleSaveWinner} className="space-y-4">
              <div>
                <Label>Nombre o ID del ganador</Label>
                <Input
                  value={winnerName}
                  onChange={(e) => setWinnerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Foto del Ganador</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && setWinnerFile(e.target.files[0])
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setWinnerModalOpen(false)}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="luxury-button" // estilo dorado
                  disabled={isSubmittingWinner} // bloquea mientras carga
                >
                  {isSubmittingWinner
                    ? "Cargando foto…" // texto durante la carga
                    : "Guardar Ganador"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaffleManagement;
