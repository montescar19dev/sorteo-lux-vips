
import React, { useState } from 'react';
import { Search, Ticket, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CheckTickets = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock data for demonstration
  const mockTickets = [
    {
      id: 1,
      raffleId: 1,
      raffleName: "iPhone 15 Pro Max",
      ticketNumbers: ["0123", "0456", "0789"],
      purchaseDate: "2024-06-28",
      status: "active",
      prizeImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      raffleId: 3,
      raffleName: "PlayStation 5",
      ticketNumbers: ["1234", "5678"],
      purchaseDate: "2024-06-25",
      status: "active",
      prizeImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock search logic - in real app this would be an API call
      const results = mockTickets.filter(ticket => 
        searchValue.includes("12345678") || // Mock phone number
        searchValue.includes("test@example.com") || // Mock email
        searchValue.includes("12345678") // Mock ID
      );
      
      setSearchResults(results);
      setIsLoading(false);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="luxury-text">Consulta</span>
            <span className="text-primary"> Tus Boletos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ingresa tu información para ver todos tus boletos y participaciones
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Search Form */}
          <Card className="luxury-card mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-primary">
                Buscar Mis Boletos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Ingresa tu Cédula, Teléfono o Email
                </label>
                <Input 
                  placeholder="Ej: V12345678, 04121234567, o email@ejemplo.com"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="luxury-border"
                />
                <p className="text-xs text-gray-500">
                  Usa la misma información que registraste al comprar
                </p>
              </div>
              
              <Button 
                onClick={handleSearch}
                disabled={isLoading || !searchValue.trim()}
                className="w-full luxury-button"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Boletos
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-6">
              {isLoading ? (
                <Card className="luxury-card">
                  <CardContent className="py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-DEFAULT mx-auto mb-4"></div>
                    <p className="text-gray-600">Buscando tus boletos...</p>
                  </CardContent>
                </Card>
              ) : searchResults.length === 0 ? (
                <Card className="luxury-card">
                  <CardContent className="py-12 text-center">
                    <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-primary mb-2">
                      No se encontraron boletos
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No hay boletos registrados con esta información
                    </p>
                    <p className="text-sm text-gray-500">
                      Verifica que hayas ingresado la información correcta
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary text-center">
                    Tus Participaciones ({searchResults.length})
                  </h3>
                  
                  {searchResults.map((ticket) => (
                    <Card key={ticket.id} className="luxury-card">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-32 md:h-32 w-full h-48 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={ticket.prizeImage} 
                              alt={ticket.raffleName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <div>
                              <h4 className="text-xl font-bold text-primary mb-1">
                                {ticket.raffleName}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>Comprado el {formatDate(ticket.purchaseDate)}</span>
                                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                                <span className="text-green-600 font-medium">Activo</span>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Tus números ({ticket.ticketNumbers.length} boletos):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {ticket.ticketNumbers.map((number, index) => (
                                  <span 
                                    key={index}
                                    className="bg-gold-gradient text-primary font-bold px-3 py-1 rounded-lg text-sm"
                                  >
                                    {number}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-700">
                                <strong>¡Buena suerte!</strong> El sorteo aún está activo. 
                                Te notificaremos por email cuando se realice.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Demo Instructions */}
          {!hasSearched && (
            <Card className="luxury-card mt-8">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Demo:</strong> Para probar la funcionalidad, usa:
                </p>
                <div className="space-y-1 text-sm text-gray-500">
                  <p>• Cédula: 12345678</p>
                  <p>• Email: test@example.com</p>
                  <p>• Teléfono: 04121234567</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckTickets;
