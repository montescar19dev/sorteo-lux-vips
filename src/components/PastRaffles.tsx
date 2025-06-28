
import React, { useState } from 'react';
import { Calendar, Trophy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PastRaffles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rafflesPerPage = 6;

  const pastRaffles = [
    {
      id: 1,
      name: "iPad Pro 12.9",
      prize: "iPad Pro 12.9 pulgadas con Apple Pencil",
      startDate: "2024-06-01",
      endDate: "2024-06-15",
      winner: "María González",
      winnerImage: "https://images.unsplash.com/photo-1494790108755-2616b332c234?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      prizeImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      name: "AirPods Pro",
      prize: "AirPods Pro 2da Generación",
      startDate: "2024-05-15",
      endDate: "2024-05-30",
      winner: "Carlos Rodríguez",
      winnerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      prizeImage: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      name: "Samsung Galaxy S24",
      prize: "Samsung Galaxy S24 Ultra 256GB",
      startDate: "2024-05-01",
      endDate: "2024-05-15",
      winner: "Ana López",
      winnerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      prizeImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      name: "Nintendo Switch OLED",
      prize: "Nintendo Switch OLED con juegos",
      startDate: "2024-04-15",
      endDate: "2024-04-30",
      winner: "Luis Martínez",
      winnerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      prizeImage: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      name: "Apple Watch Series 9",
      prize: "Apple Watch Series 9 45mm",
      startDate: "2024-04-01",
      endDate: "2024-04-15",
      winner: "Carmen Silva",
      winnerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      prizeImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      name: "MacBook Pro M3",
      prize: "MacBook Pro M3 14 pulgadas",
      startDate: "2024-03-15",
      endDate: "2024-03-31",
      winner: "Diego Herrera",
      winnerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      prizeImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const totalPages = Math.ceil(pastRaffles.length / rafflesPerPage);
  const startIndex = (currentPage - 1) * rafflesPerPage;
  const displayedRaffles = pastRaffles.slice(startIndex, startIndex + rafflesPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="luxury-text">Sorteos</span>
            <span className="text-primary"> Realizados</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conoce a nuestros ganadores y los increíbles premios que han obtenido
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedRaffles.map((raffle, index) => (
            <div 
              key={raffle.id} 
              className="luxury-card p-6 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <img 
                  src={raffle.prizeImage} 
                  alt={raffle.prize}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Finalizado
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-primary mb-2">{raffle.name}</h3>
              <p className="text-gray-600 mb-4">{raffle.prize}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Inicio: {formatDate(raffle.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Finalización: {formatDate(raffle.endDate)}</span>
                </div>
              </div>

              {raffle.winner && (
                <div className="bg-gold-gradient p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={raffle.winnerImage} 
                      alt={raffle.winner}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <p className="text-sm text-primary/80 font-medium">Ganador</p>
                      <p className="font-bold text-primary">{raffle.winner}</p>
                    </div>
                    <Trophy className="w-5 h-5 text-primary ml-auto" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button 
              variant="outline" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="border-gold-DEFAULT text-gold-dark hover:bg-gold-DEFAULT/10"
            >
              Anterior
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 
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
              onClick={() => setCurrentPage(currentPage + 1)}
              className="border-gold-DEFAULT text-gold-dark hover:bg-gold-DEFAULT/10"
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastRaffles;
