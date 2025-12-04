
import React from 'react';
import { Instagram } from 'lucide-react';
import { MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <h3 className="text-4xl font-bold">
              <span className="luxury-text">RAFFLES</span>
              <br />
              <span className="text-white">GOLD</span>
            </h3>
            <p className="text-gold-light mt-2">
              Tu oportunidad de oro
            </p>
          </div>

          {/* Social Links */}
          <div className="mb-8">
            <h4 className="text-xl font-bold mb-4 text-gold-light">
              Síguenos en Redes Sociales
            </h4>
            <div className="flex justify-center gap-6">
              <a 
                href="https://instagram.com/#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-orange-500 px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300"
              >
                <Instagram className="w-5 h-5" />
                <span className="font-medium">Instagram</span>
              </a>
              
              <a 
                href="https://wa.me/584128358529" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-8 text-center">
            <p className="text-gold-light mb-2">
              Atención al Cliente
            </p>
            <p className="text-white">
              Lunes a Viernes: 8:00 AM - 6:00 PM
            </p>
            <p className="text-white">
              Sábados: 9:00 AM - 2:00 PM
            </p>
          </div>

          {/* Legal */}
          <div className="border-t border-gold-DEFAULT/30 pt-8">
            <p className="text-sm text-gold-light/80 mb-2">
              © 2025 Raffles Gold. Todos los derechos reservados. Desarrollado por Carlos Montes.
            </p>
            <p className="text-xs text-gold-light/60">
              Sorteos realizados de manera transparente y legal en territorio venezolano.
              <br />
              Participantes mayores de 18 años únicamente.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex justify-center items-center gap-8 text-xs text-gold-light/60">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Pagos Seguros</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Sorteos Transparentes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Entrega Garantizada</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
