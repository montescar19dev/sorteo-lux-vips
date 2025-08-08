
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
  <div className="bg-black rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col luxury-border">
    {/* Header */}
    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
      <h2 className="text-2xl font-bold luxury-text">Términos y Condiciones</h2>
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
        <p className="text-white">
          <h3 className="font-bold text-white mb-2">BIENVENIDO A <strong>WWW.TUSORTEOVIP.COM</strong><br /></h3>
          
          Al acceder y utilizar nuestra plataforma de rifas, aceptas los términos y condiciones establecidos a continuación. Por favor, lee detenidamente estos términos antes de usar nuestros servicios.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">1. REGISTRO Y DATOS PERSONALES</h3>
        <p className="text-white">
          Para poder participar en nuestras rifas, el usuario debe completar el formulario de registro con la siguiente información verídica y actualizada:<br />
          <br />
          • Nombre y Apellido<br />
          • Número telefónico<br />
          • Correo electrónico<br />
          <br />
          Es responsabilidad del usuario mantener sus datos personales actualizados. www.tusorteovip.com no se hace responsable por problemas derivados de información incorrecta o desactualizada.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">2. COMPROBANTES DE PAGO Y VERIFICACIÓN DE IDENTIDAD</h3>
        <p className="text-white">
          En caso de resultar ganador, el usuario deberá presentar un comprobante de pago válido para poder validar su participación y derecho al premio.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">3. DATOS PERSONALES ADICIONALES PARA GANADORES</h3>
        <p className="text-white">
          Los ganadores deberán proporcionar los siguientes datos adicionales:<br />
          • Cédula de identidad<br />
          • Ticket ganador / Orden de compra<br />
          • Captura de pago<br />
          <br />
          Estos datos se utilizarán exclusivamente para la validación de la participación y entrega del premio.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">4. REDES SOCIALES DE LOS GANADORES</h3>
        <p className="text-white">
          Los ganadores deberán aceptar que se difundan fotos y videos de ellos y del premio en nuestras redes sociales para corroborar la fidelidad de la misma.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">5. REQUISITOS DE EDAD</h3>
        <p className="text-white">
          Para participar, el usuario debe ser mayor de 18 años. Al registrarse, el usuario declara que cumple con este requisito. No se permite la participación de menores de edad.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">6. REPRESENTANTE AUTORIZADO PARA PARTICIPANTES INTERNACIONALES</h3>
        <p className="text-white">
          Si el usuario reside fuera de Venezuela, deberá designar un representante legal dentro del país con una autorización firmada para recibir el premio en su nombre o recibir el valor del premio en dinero por transferencias internacionales.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">7. PLAZO PARA RETIRAR EL PREMIO</h3>
        <p className="text-white">
          El ganador tiene un plazo de 30 días naturales a partir del anuncio para retirar su premio. Si no lo hace en ese período, el premio será considerado no reclamado y www.tusorteovip.com podrá disponer de él.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">8. USO DE CORREO ELECTRÓNICO</h3>
        <p className="text-white">
          Al registrarse, el usuario acepta que su correo electrónico sea utilizado para enviarle notificaciones sobre nuevos sorteos, actualizaciones y promociones.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">9. NOTIFICACIONES PUSH</h3>
        <p className="text-white">
          Al habilitar las notificaciones push en tu dispositivo, aceptas recibir avisos relacionados con sorteos y actualizaciones de www.tusorteovip.com.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">10. POLÍTICA DE CAMBIOS DE NÚMEROS COMPRADOS</h3>
        <p className="text-white">
          Una vez aprobado el número elegido, no será posible cambiarlo. Si deseas un número diferente, deberás realizar una nueva compra.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">11. MÉTODOS DE PAGO</h3>
        <p className="text-white">
          Los pagos se deben realizar únicamente a través de los métodos y datos de pago proporcionados en nuestra plataforma oficial. Cualquier otro medio de pago no será reconocido.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">12. INFORMACIÓN DE CONTACTO</h3>
        <p className="text-white">
          Para cualquier consulta o dudas, puedes ponerte en contacto con nosotros a través de los siguientes canales:<br />
          <br />
          • Teléfono: +58 424-4491417<br />
          • Dirección: Valencia, Venezuela.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">13. LOTERÍA DEL TÁCHIRA</h3>
        <p className="text-white">
          La lotería que se utiliza en nuestras rifas es la Lotería del Táchira. Asegúrate de estar al tanto de los resultados y de seguir las instrucciones para participar correctamente.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">14. PRESENTACIÓN CORRECTA DEL COMPROBANTE DE PAGO</h3>
        <p className="text-white">
          El usuario debe enviar su comprobante de pago con la referencia claramente visible y legible. Si el comprobante enviado está incompleto, borroso o la referencia es incorrecta, la orden será rechazada y el usuario será notificado por correo electrónico. En caso de no corregir el error dentro del plazo indicado, el ticket podría ser anulado, y el dinero transferido quedará en abono para otro ticket o evento, mas no se hace devolución de dinero.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">15. MODIFICACIÓN DE LOS TÉRMINOS Y CONDICIONES</h3>
        <p className="text-white">
          www.tusorteovip.com se reserva el derecho de modificar estos términos en cualquier momento. Cualquier cambio será notificado a los usuarios a través de la plataforma. Es responsabilidad del usuario revisar estos términos periódicamente.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-white mb-2">16. POLÍTICA DE REEMBOLSO Y USO DE FONDOS</h3>
        <p className="text-white">
          Entendemos que pueden surgir imprevistos, pero queremos asegurarnos de que cada participante tenga la mejor experiencia posible. Por esta razón, te informamos que cualquier monto abonado a nuestras cuentas y que posteriormente se solicite como reembolso, no podrá ser devuelto en efectivo. En su lugar, el saldo quedará registrado como un abono disponible, que podrás utilizar para la compra de nuevos tickets en sorteos futuros o para participar en otros eventos dentro de nuestra plataforma. Apreciamos tu comprensión y tu confianza en www.tusorteovip.com. ¡Seguimos trabajando para ofrecerte las mejores oportunidades de ganar!
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
          className="text-sm font-medium text-white cursor-pointer"
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
