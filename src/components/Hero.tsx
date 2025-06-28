
import React from 'react';
import { Clock, Trophy, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const activeRaffles = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      prize: "iPhone 15 Pro Max 256GB",
      endDate: "2024-07-15",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ticketPrice: 25,
      timeRemaining: "5 días, 12 horas"
    },
    {
      id: 2,
      name: "MacBook Air M3",
      prize: "MacBook Air M3 15 pulgadas",
      endDate: "2024-07-20",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ticketPrice: 50,
      timeRemaining: "10 días, 8 horas"
    },
    {
      id: 3,
      name: "PlayStation 5",
      prize: "PlayStation 5 con 2 controles",
      endDate: "2024-07-25",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ticketPrice: 30,
      timeRemaining: "15 días, 20 horas"
    }
  ];

  return (
    <div className="relative min-h-screen bg-dark-gradient overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold-DEFAULT rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold-light rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="luxury-text">SORTEO</span>
            <br />
            <span className="text-white">VIP</span>
          </h1>
          <p className="text-xl md:text-2xl text-gold-light font-light max-w-2xl mx-auto">
            Participa en sorteos exclusivos y gana increíbles premios. 
            Tu oportunidad de oro está aquí.
          </p>
        </div>

        {/* Active Raffles Carousel */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="luxury-text">Sorteos Activos</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {activeRaffles.map((raffle, index) => (
              <div 
                key={raffle.id} 
                className="luxury-card p-6 animate-slide-in hover:animate-glow group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <img 
                    src={raffle.image} 
                    alt={raffle.prize}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-primary/90 text-gold-light px-3 py-1 rounded-full text-sm font-bold">
                    ${raffle.ticketPrice} USD
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-primary mb-2">{raffle.name}</h3>
                <p className="text-gray-600 mb-4">{raffle.prize}</p>
                
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Quedan: {raffle.timeRemaining}</span>
                </div>
                
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-orange-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-orange-700 font-medium text-center">
                    ¡Aún tienes tiempo de participar!
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full luxury-button">
                    <Ticket className="w-4 h-4 mr-2" />
                    Comprar Boletos
                  </Button>
                  <Button variant="outline" className="w-full border-gold-DEFAULT text-gold-dark hover:bg-gold-DEFAULT/10">
                    Ver Mis Boletos
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-luxury-gradient p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">
            <Trophy className="w-16 h-16 text-white mx-auto mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para Ganar?
            </h3>
            <p className="text-xl text-gold-light mb-8 max-w-2xl mx-auto">
              Únete a miles de participantes que ya han confiado en Sorteo VIP. 
              Tu premio te está esperando.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-xl">
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
