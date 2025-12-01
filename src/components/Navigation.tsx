import React from "react";
import { Ticket, Search, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onCheckTickets: () => void;
  onParticipateClick: () => void;
}

const Navigation = ({
  onCheckTickets,
  onParticipateClick,
}: NavigationProps) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[rgba(10,10,10,0.8)] text-white backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <span className="luxury-text">RAFFLES</span>
              <span className="text-white ml-1">GOLD</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-white hover:text-gold-DEFAULT transition-colors font-medium"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("hero")}
              className="text-white hover:text-gold-DEFAULT transition-colors font-medium"
            >
              Sorteos Activos
            </button>
            <button
              onClick={() => scrollToSection("past-raffles")}
              className="text-ehite hover:text-gold-DEFAULT transition-colors font-medium"
            >
              Ganadores
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onCheckTickets}
              className="border-gold-DEFAULT text-gold-dark hover:bg-gold-DEFAULT/10"
            >
              <Search className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Mis Boletos</span>
            </Button>

            <Button onClick={onParticipateClick} className="luxury-button">
              <Ticket className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Participar</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
