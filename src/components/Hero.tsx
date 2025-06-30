
import React, { useState, useEffect } from 'react';
import { Clock, Trophy, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeRaffles = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      subtitle: "256GB - Titanio Natural",
      prize: "iPhone 15 Pro Max 256GB",
      endDate: "2024-07-15",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ticketPrice: 250,
      timeRemaining: "5 días, 12 horas"
    },
    {
      id: 2,
      name: "Toyota Land Cruiser Prado",
      subtitle: "Modelo 2020",
      prize: "Toyota Land Cruiser Prado 2020",
      endDate: "2024-07-20",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ticketPrice: 500,
      timeRemaining: "10 días, 8 horas"
    },
    {
      id: 3,
      name: "MacBook Pro M3",
      subtitle: "16 pulgadas - 512GB",
      prize: "MacBook Pro M3 16 pulgadas",
      endDate: "2024-07-25",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ticketPrice: 400,
      timeRemaining: "15 días, 20 horas"
    }
  ];

  // Auto-slide every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeRaffles.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [activeRaffles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeRaffles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeRaffles.length) % activeRaffles.length);
  };

  const currentRaffle = activeRaffles[currentSlide];

  return (
    <div className="relative min-h-screen bg-dark-gradient overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#D4AA7D] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#EFD09E] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header - Fixed single line title */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 flex items-center justify-center gap-4">
            <span className="luxury-text">SORTEO</span>
            <span className="text-white">VIP</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#EFD09E] font-light max-w-2xl mx-auto">
            Participa en sorteos exclusivos y gana increíbles premios. 
            Tu oportunidad de oro está aquí.
          </p>
        </div>

        {/* Single Large Horizontal Raffle Card */}
        <div className="mb-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="luxury-text">Sorteo Activo</span>
          </h2>
          
          {/* Carousel Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Navigation Arrows */}
            {activeRaffles.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-[#D4AA7D]/20 hover:bg-[#D4AA7D]/40 backdrop-blur-sm border border-[#D4AA7D]/30 rounded-full p-3 transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-[#EFD09E]" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-[#D4AA7D]/20 hover:bg-[#D4AA7D]/40 backdrop-blur-sm border border-[#D4AA7D]/30 rounded-full p-3 transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-[#EFD09E]" />
                </button>
              </>
            )}

            {/* Large Horizontal Card - Fixed Height */}
            <div className="bg-[#1D1D1D] rounded-2xl border border-[#D4AA7D]/30 shadow-2xl overflow-hidden animate-fade-in">
              <div className="flex flex-col md:flex-row h-auto md:h-[420px]">
                {/* Left Side - Product Image with Golden Glow - Fixed Container */}
                <div className="relative w-full md:w-1/2 h-64 md:h-full overflow-hidden bg-gradient-to-br from-[#2A2A2A] to-[#1D1D1D] flex items-center justify-center">
                  {/* Golden Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-[#D4AA7D]/20 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-[#EFD09E]/30 via-[#D4AA7D]/10 to-transparent rounded-full blur-3xl"></div>
                  
                  {/* Product Image - Fixed sizing */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                    <img 
                      src={currentRaffle.image} 
                      alt={currentRaffle.prize}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Right Side - Raffle Information - Fixed Structure */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center space-y-6">
                  {/* Title and Subtitle */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {currentRaffle.name}
                    </h3>
                    <p className="text-lg text-[#D4AA7D] font-medium">
                      {currentRaffle.subtitle}
                    </p>
                  </div>
                  
                  {/* Time Remaining */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#EFD09E]" />
                    <span className="text-[#EFD09E] text-lg font-medium">
                      Quedan: {currentRaffle.timeRemaining}
                    </span>
                  </div>

                  {/* Ticket Price Section */}
                  <div>
                    <p className="text-[#D4AA7D] text-sm font-medium mb-2">
                      Precio del ticket:
                    </p>
                    <div className="inline-block bg-gradient-to-r from-[#D4AA7D] to-[#EFD09E] text-[#1D1D1D] px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      {currentRaffle.ticketPrice} Bs.
                    </div>
                  </div>
                  
                  {/* Participation Message */}
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-[#D4AA7D]/30 rounded-lg p-3">
                    <p className="text-[#EFD09E] font-medium text-center text-sm">
                      ¡Aún tienes tiempo de participar!
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-[#D4AA7D] to-[#EFD09E] text-[#1D1D1D] hover:from-[#B8956A] hover:to-[#D4AA7D] font-bold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <Ticket className="w-5 h-5 mr-2" />
                      Comprar Boletos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#D4AA7D] text-[#D4AA7D] hover:bg-[#D4AA7D]/10 py-3 text-base font-medium"
                    >
                      Ver Mis Boletos
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            {activeRaffles.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {activeRaffles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-[#D4AA7D] shadow-lg' 
                        : 'bg-[#D4AA7D]/30 hover:bg-[#D4AA7D]/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-luxury-gradient p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">
            <Trophy className="w-16 h-16 text-white mx-auto mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para Ganar?
            </h3>
            <p className="text-xl text-[#EFD09E] mb-8 max-w-2xl mx-auto">
              Únete a miles de participantes que ya han confiado en Sorteo VIP. 
              Tu premio te está esperando.
            </p>
            <Button size="lg" className="bg-white text-[#272727] hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-xl">
              <Trophy className="w-5 h-5 mr-2" />
              Participar Ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
