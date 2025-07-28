import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign } from "lucide-react";
import BuyTicketsButton from "../BuyTicketsButton";

const HeroExample: React.FC = () => {
  // Mock raffle data
  const currentRaffle = {
    id: "1",
    title: "Toyota Land Cruiser Prado 2024",
    description: "SUV de lujo completamente equipado con todas las comodidades",
    ticketPrice: 50,
    totalTickets: 1000,
    ticketsSold: 750,
    endDate: "2024-12-31",
    image: "/placeholder.svg",
    status: "active" as "active" | "paused" | "ended" | "closed",
  };

  // Calculamos el progreso de venta
  const progress =
    (currentRaffle.ticketsSold / currentRaffle.totalTickets) * 100;

  // Mapa de estados para etiqueta y color de badge
  const statusMap: Record<
    "active" | "paused" | "ended" | "closed",
    { label: string; className: string }
  > = {
    active: { label: "Activo", className: "bg-green-500" },
    paused: { label: "Pausado", className: "bg-yellow-500" },
    ended: { label: "ended", className: "bg-blue-500" },
    closed: { label: "Cerrado", className: "bg-gray-500" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#272727] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="luxury-text">Sorteo VIP</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Tu oportunidad de ganar premios increíbles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Raffle Image */}
          <div className="relative">
            <img
              src={currentRaffle.image}
              alt={currentRaffle.title}
              className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-2xl"
            />
            {/* Badge dinámico según estado */}
            {(() => {
              const { label, className } = statusMap[currentRaffle.status];
              return (
                <Badge className={`absolute top-4 right-4 ${className} text-white`}>
                  {label}
                </Badge>
              );
            })()}
          </div>

          {/* Raffle Details */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="text-2xl luxury-text">
                {currentRaffle.title}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {currentRaffle.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-[#D4AA7D]" />
                  <div>
                    <p className="text-sm text-gray-600">Precio</p>
                    <p className="font-bold">Bs. {currentRaffle.ticketPrice}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[#D4AA7D]" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha límite</p>
                    <p className="font-bold">{currentRaffle.endDate}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progreso</span>
                  <span className="text-sm font-medium">
                    {currentRaffle.ticketsSold}/{currentRaffle.totalTickets}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#D4AA7D] to-[#EFD09E] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {progress.toFixed(1)}% vendido
                </p>
              </div>

              <div className="pt-4">
                <BuyTicketsButton
                  raffleId={currentRaffle.id}
                  raffleTitle={currentRaffle.title}
                  ticketPrice={currentRaffle.ticketPrice}
                  maxTickets={10}
                  disabled={currentRaffle.status !== "active"}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroExample;
