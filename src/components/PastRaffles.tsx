import React, { useState, useEffect } from "react";
import { Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Raffle {
  _id: string;
  title: string; // nombre de la rifa
  description: string; // descripción / premio
  imageUrl?: string; // imagen del premio
  createdAt: string; // fecha de creación
  endDate: string; // fecha de cierre
  status: "active" | "paused" | "ended";
  winner?: string;
  winnerImage?: string;
}

const PastRaffles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rafflesPerPage = 6;

  // estados para datos y modal
  const [pastRaffles, setPastRaffles] = useState<Raffle[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string>("");

  // cargar rifas que ya terminaron
  useEffect(() => {
    const fetchPastRaffles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/raffles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar rifas");
        const all: Raffle[] = await res.json();
        setPastRaffles(all.filter((r) => r.status === "ended"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPastRaffles();
  }, []);

  // paginación
  const totalPages = Math.ceil(pastRaffles.length / rafflesPerPage);
  const startIndex = (currentPage - 1) * rafflesPerPage;
  const displayedRaffles = pastRaffles.slice(
    startIndex,
    startIndex + rafflesPerPage
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const openWinnerModal = (imgUrl: string) => {
    setModalImage(imgUrl);
    setModalOpen(true);
  };
  const closeWinnerModal = () => {
    setModalOpen(false);
    setModalImage("");
  };

  return (
    <>
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="luxury-text">Sorteos</span>
              <span className="text-primary"> Realizados</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce a nuestros ganadores y los increíbles premios que han
              obtenido
            </p>
          </div>

          {/* Tarjetas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedRaffles.map((raffle, index) => (
              <div
                key={raffle._id}
                className="luxury-card p-6 animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <img
                    src={raffle.imageUrl || "/placeholder.png"}
                    alt={raffle.description}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Finalizado
                  </div>
                </div>

                <h3 className="text-xl font-bold text-primary mb-2">
                  {raffle.title}
                </h3>
                <p className="text-gray-600 mb-4">{raffle.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Inicio: {formatDate(raffle.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Finalización: {formatDate(raffle.endDate)}</span>
                  </div>
                </div>

                {raffle.winner && (
                  <div className="bg-gold-gradient p-4 rounded-lg space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={raffle.winnerImage}
                        alt={raffle.winner}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                      />
                      <div>
                        <p className="text-sm text-primary/80 font-medium">
                          Ganador
                        </p>
                        <p className="font-bold text-primary">
                          {raffle.winner}
                        </p>
                      </div>
                      <Trophy className="w-5 h-5 text-primary ml-auto" />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => openWinnerModal(raffle.winnerImage!)}
                      className="w-full"
                    >
                      Ver foto del Ganador
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="border-gold-DEFAULT text-gold-dark hover:bg-gold-DEFAULT/10"
              >
                Anterior
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                  className={
                    currentPage === i + 1
                      ? "luxury-button"
                      : "border-gold-DEFAULT text-gold-dark hover:bg-gold-DEFAULT/10"
                  }
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="border-gold-DEFAULT text-gold-dark hover:bg-gold-DEFAULT/10"
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal responsive */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <img
              src={modalImage}
              alt="Foto del Ganador"
              className="max-w-full max-h-full rounded-lg"
            />
            <Button
              onClick={closeWinnerModal}
              className="absolute top-2 right-2 bg-white text-[#272727] hover:bg-gray-100 font-medium px-3 py-1 rounded shadow"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PastRaffles;
