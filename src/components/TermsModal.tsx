
import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsModal = ({ isOpen, onClose, onAccept }: TermsModalProps) => {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isScrolledToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    if (isScrolledToBottom) {
      setHasScrolled(true);
    }
  };

  const handleAccept = () => {
    if (hasAccepted) {
      onAccept();
      localStorage.setItem('sorteoVIP_termsAccepted', 'true');
    }
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setHasAccepted(checked === true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col luxury-border">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold luxury-text">
            Términos y Condiciones
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-4 text-sm leading-relaxed"
          onScroll={handleScroll}
        >
          <div>
            <h3 className="font-bold text-primary mb-2">1. ACEPTACIÓN DE TÉRMINOS</h3>
            <p className="text-gray-700">
              Al participar en los sorteos de Sorteo VIP, usted acepta estar sujeto a estos términos y condiciones. 
              Si no está de acuerdo con alguno de estos términos, no debe participar en nuestros sorteos.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">2. ELEGIBILIDAD</h3>
            <p className="text-gray-700">
              Para participar en nuestros sorteos debe ser mayor de 18 años y residir en territorio venezolano. 
              Los empleados de Sorteo VIP y sus familiares directos no son elegibles para participar.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">3. COMPRA DE BOLETOS</h3>
            <p className="text-gray-700">
              • La compra mínima es de 2 boletos por transacción<br/>
              • Los números son asignados automáticamente de forma aleatoria<br/>
              • No se permiten números duplicados dentro del mismo sorteo<br/>
              • Los precios están expresados en USD para Zelle y en Bolívares para Pago Móvil<br/>
              • Todas las compras deben incluir comprobante de pago válido
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">4. MÉTODOS DE PAGO</h3>
            <p className="text-gray-700">
              Aceptamos pagos a través de Zelle (USD) y Pago Móvil (Bolívares). 
              El monto exacto debe ser transferido. Pagos incorrectos no serán procesados automáticamente.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">5. CONFIRMACIÓN DE PARTICIPACIÓN</h3>
            <p className="text-gray-700">
              Una vez procesado el pago, recibirá un email de confirmación con sus números de boletos. 
              Este email es su comprobante oficial de participación.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">6. REALIZACIÓN DEL SORTEO</h3>
            <p className="text-gray-700">
              Los sorteos se realizan en las fechas programadas utilizando los resultados de la lotería nacional. 
              Los ganadores son seleccionados de forma transparente y verificable.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">7. NOTIFICACIÓN DE GANADORES</h3>
            <p className="text-gray-700">
              Los ganadores serán contactados por email y teléfono dentro de las 48 horas posteriores al sorteo. 
              También se publicará en nuestras redes sociales oficiales.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">8. ENTREGA DE PREMIOS</h3>
            <p className="text-gray-700">
              Los premios deben ser reclamados dentro de los 30 días posteriores al sorteo. 
              La entrega se coordina directamente con el ganador. Los gastos de envío corren por cuenta de Sorteo VIP.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">9. POLÍTICA DE REEMBOLSOS</h3>
            <p className="text-gray-700">
              No se realizan reembolsos una vez procesado el pago, excepto en casos de cancelación del sorteo por causas de fuerza mayor.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">10. PRIVACIDAD</h3>
            <p className="text-gray-700">
              Nos comprometemos a proteger su información personal. Los datos recopilados se utilizan únicamente 
              para fines del sorteo y comunicaciones relacionadas.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">11. MODIFICACIONES</h3>
            <p className="text-gray-700">
              Sorteo VIP se reserva el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán notificados a través de nuestro sitio web.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-2">12. CONTACTO</h3>
            <p className="text-gray-700">
              Para cualquier consulta o reclamo, puede contactarnos a través de nuestras redes sociales 
              o los medios de contacto oficiales publicados en el sitio web.
            </p>
          </div>

          <div className="bg-gold-gradient p-4 rounded-lg">
            <p className="text-primary font-medium text-center">
              Al marcar la casilla de aceptación, confirma que ha leído, entendido y acepta 
              todos los términos y condiciones aquí establecidos.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="accept-terms"
              checked={hasAccepted}
              onCheckedChange={handleCheckboxChange}
              className="border-gold-DEFAULT data-[state=checked]:bg-gold-DEFAULT"
            />
            <label 
              htmlFor="accept-terms" 
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              He leído y acepto los términos y condiciones
            </label>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-gray-300"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!hasAccepted}
              className="flex-1 luxury-button"
            >
              <Check className="w-4 h-4 mr-2" />
              Aceptar y Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
