/* Código actualizado de Hero.tsx con los cambios aplicados */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from 'react-router-dom';
import { Clock, Trophy, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentWizard from "@/components/PaymentWizard";
import { Raffle } from "@/types/Raffle";

interface HeroProps {
  raffles: Raffle[];
}

const Hero = forwardRef(({ raffles }: HeroProps, ref) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const navigate = useNavigate();

  // Auto-slide every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % raffles.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [raffles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % raffles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + raffles.length) % raffles.length);
  };

  const currentRaffle = raffles[currentSlide];

  const openPurchaseModal = (raffle?: Raffle) => {
    setSelectedRaffle(raffle ?? null);
    setIsModalOpen(true);
  };

  const openPurchaseModalForRaffle = (raffle: Raffle) => {
    setSelectedRaffle(raffle);
    setIsModalOpen(true);
  };

  const closePurchaseModal = () => {
    setIsModalOpen(false);
  };

  useImperativeHandle(ref, () => ({
    openPurchaseModal,
    openPurchaseModalForRaffle,
  }));

  if (!currentRaffle) return null;

  const imageUrl =
    currentRaffle.imageUrl ||
    "https://via.placeholder.com/800x600.png?text=Sorteo+VIP";

  const calculateTimeRemaining = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) return "ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days} días, ${hours} horas`;
  };

  return (
    <div className="relative min-h-screen bg-dark-gradient overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FFD700] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header - Fixed single line title */}
        <div className="text-center mb-5 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 flex items-center justify-center gap-4">
            <span className="luxury-text">RAFFLES</span>
            <span className="text-white">GOLD</span>
          </h1>
          <p className="text-xl md:text-2xl text-white font-light max-w-2xl mx-auto">
            Participa en sorteos exclusivos y gana increíbles premios. Tu
            oportunidad de oro está aquí.
          </p>
        </div>

        {/* Single Large Horizontal Raffle Card */}
        <div className="mb-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-5">
            <span className="text-white">Sorteo Activo</span>
          </h2>

          {/* Carousel Container with External Navigation */}
          <div className="relative max-w-6xl mx-auto">
            {/* Navigation Arrows - Outside the card */}
            {raffles.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute -left-16 top-1/2 -translate-y-1/2 z-20 bg-[#FFD700]/20 hover:bg-[#FFD700]/40 backdrop-blur-sm border border-[#FFD700]/30 rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-lg hidden md:flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6 text-[#FFD700]" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute -right-16 top-1/2 -translate-y-1/2 z-20 bg-[#FFD700]/20 hover:bg-[#FFD700]/40 backdrop-blur-sm border border-[#FFD700]/30 rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-lg hidden md:flex items-center justify-center"
                >
                  <ChevronRight className="w-6 h-6 text-[#FFD700]" />
                </button>
              </>
            )}

            {/* Large Horizontal Card - Fixed Height */}
            <div className="bg-[#1D1D1D] rounded-2xl border border-[#FFD700]/30 shadow-2xl overflow-hidden animate-fade-in">
              <div className="flex flex-col md:flex-row h-auto md:h-[420px]">
                {/* Left Side - Product Image with Golden Glow - Fixed Container */}
                <div className="relative w-full md:w-1/2 h-64 md:h-full overflow-hidden bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] flex items-center justify-center">
                  {/* Golden Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-[#FFD700]/20 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-[#FFD700]/30 via-[#FFD700]/10 to-transparent rounded-full blur-3xl"></div>

                  {/* Product Image - Fixed sizing */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                    <img
                      src={imageUrl}
                      alt={currentRaffle.title}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    />

                    <PaymentWizard
                      isOpen={isModalOpen}
                      onClose={closePurchaseModal}
                      ticketQuantity={1}
                      raffles={raffles}
                      initialRaffle={selectedRaffle}
                    />
                  </div>
                </div>

                {/* Right Side - Raffle Information - Fixed Structure */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center space-y-6">
                  {/* Title and Subtitle */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#FFC107] mb-2">
                      {currentRaffle.title}
                    </h3>
                    <p className="text-lg text-white font-medium">
                      {currentRaffle.description}
                    </p>
                  </div>

                  {/* Time Remaining */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-[#FFC107] text-lg font-medium">
                      Quedan: {calculateTimeRemaining(currentRaffle.endDate)}
                    </span>
                  </div>

                  {/* Ticket Price Section */}
                  <div>
                    <p className="text-white text-sm font-medium mb-2">
                      Precio del ticket:
                    </p>
                    <div className="inline-block bg-gradient-to-r from-[#FFD700] to-[#e3ab02] text-[#1D1D1D] px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      {currentRaffle.ticketPrice} Bs.
                    </div>
                  </div>

                  {/* Participation Message */}
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-[#FFD700]/30 rounded-lg p-3">
                    <p className="text-white font-medium text-center text-sm">
                      ¡Aún tienes tiempo de participar!
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => openPurchaseModalForRaffle(currentRaffle)}
                      className="w-full bg-gradient-to-r from-[#FFD700] to-[#e3ab02] text-[#1D1D1D] hover:..."
                      disabled={currentRaffle.status !== "active"}
                    >
                      <Ticket className="w-5 h-5 mr-2" />
                      {currentRaffle.status === "active"
                        ? "Comprar Boletos"
                        : currentRaffle.status === "paused"
                        ? "Pausado"
                        : "ended"}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-[#FFD700] text-black hover:bg-[#FFD700]/100 py-3 text-base font-medium"
                      onClick={() => navigate('/check-tickets')}
                    >
                      Ver Mis Boletos
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Arrows - Below card */}
            {raffles.length > 1 && (
              <div className="flex justify-center gap-4 mt-6 md:hidden">
                <button
                  onClick={prevSlide}
                  className="bg-[#FFD700]/20 hover:bg-[#FFD700]/40 backdrop-blur-sm border border-[#FFD700]/30 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 text-[#FFD700]" />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-[#FFD700]/20 hover:bg-[#FFD700]/40 backdrop-blur-sm border border-[#FFD700]/30 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6 text-[#FFD700]" />
                </button>
              </div>
            )}

            {/* Slide Indicators */}
            {raffles.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {raffles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-[#FFD700] shadow-lg"
                        : "bg-[#FFD700]/30 hover:bg-[#FFD700]/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border-[1px] border-[#FFD700] p-8 bg-transparent">
            <Trophy className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-4">
              ¿Listo para Ganar?
            </h3>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Únete a miles de participantes que ya han confiado en Sorteo VIP.
              Tu premio te está esperando.
            </p>
            <Button
              onClick={() => openPurchaseModal(undefined)}
              size="lg"
              className="bg-white text-[#272727] hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-xl"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Participar Ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Hero;