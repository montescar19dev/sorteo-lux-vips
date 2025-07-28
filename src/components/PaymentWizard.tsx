import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCreatePurchase } from "@/api/useCreatePurchase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Clock,
  CreditCard,
  CheckCircle,
  Phone,
  User,
  Hash,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Raffle {
  _id: string;
  title: string;
  ticketPrice: number;
}

interface PaymentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  raffles: Raffle[];
  ticketQuantity: number;
  initialRaffle?: Raffle;
}

interface UserData {
  fullName: string;
  idType: "V" | "E";
  idNumber: string;
  phone: string;
  email: string;
}

interface PaymentData {
  reference: string;
  screenshot: File | null;
}

const PaymentWizard: React.FC<PaymentWizardProps> = ({
  isOpen,
  onClose,
  raffles,
  ticketQuantity,
  initialRaffle,
}) => {
  const { toast } = useToast();
  const createPurchaseMutation = useCreatePurchase();
  const [currentStep, setCurrentStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [assignedTickets, setAssignedTickets] = useState<string[]>([]);
  // marca que el usuario ha leído el aviso “Pendiente de verificación”
  const [ackPending, setAckPending] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    idType: "V",
    idNumber: "",
    phone: "",
    email: "",
  });

  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [localTicketQuantity, setLocalTicketQuantity] = useState<number>(
    ticketQuantity || 1
  );

  useEffect(() => {
    if (initialRaffle) {
      setSelectedRaffle(initialRaffle);
    }
  }, [initialRaffle]);

  const [paymentData, setPaymentData] = useState<PaymentData>({
    reference: "",
    screenshot: null,
  });

  // --- USD rate (BCV) ---
  const [usdRate, setUsdRate] = useState<number | null>(null);

  // --- asegurar tipos numéricos ---
  const totalAmount = selectedRaffle
    ? Number(selectedRaffle.ticketPrice) * Number(localTicketQuantity)
    : 0;

  // Timer countdown
  useEffect(() => {
    if (currentStep === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      toast({
        title: "Tiempo agotado",
        description: "El tiempo para completar el pago ha expirado.",
        variant: "destructive",
      });
      onClose();
    }
  }, [currentStep, timeLeft, onClose, toast]);

  // Obtener tasa BCV al montar
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const resp = await fetch("http://localhost:5000/api/rates/usd-bcv");
        const json = await resp.json();
        if (json.success && typeof json.rate === "number") {
          setUsdRate(json.rate);
        }
      } catch (e) {
        console.error("No se pudo obtener USD rate:", e);
      }
    };
    fetchRate();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStep1Submit = () => {
    if (
      !selectedRaffle ||
      !userData.fullName ||
      !userData.idNumber ||
      !userData.phone ||
      !userData.email
    ) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Continue = () => {
    setCurrentStep(3);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentData({ ...paymentData, screenshot: file });
    }
  };

  const handleStep3Submit = () => {
    if (!paymentData.reference || !paymentData.screenshot) {
      toast({
        title: "Datos incompletos",
        description: "Por favor ingrese la referencia y suba el comprobante.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRaffle) {
      toast({
        title: "Error",
        description: "No se ha seleccionado una rifa.",
        variant: "destructive",
      });
      return;
    }

    // --- Cálculos numéricos seguros (PASO 1) ---
    const ticketPrice = Number(selectedRaffle?.ticketPrice ?? 0);
    const qty = Number(localTicketQuantity ?? 0);

    const amount = ticketPrice * qty;
    const ticketCount = qty;

    const payload = {
      fullName: userData.fullName,
      phoneNumber: userData.phone,
      raffleId: selectedRaffle._id,
      amount, // <- numérico
      ticketCount, // <- numérico
      paymentMethod: "transfer",
      status: "pending",
      transactionId: paymentData.reference,
      screenshot: paymentData.screenshot, // nombre a validar en Paso 3
    };

    console.log("🧾 Payload final:", {
      ...payload,
      screenshot: paymentData.screenshot?.name,
    });

    createPurchaseMutation.mutate(payload, {
      onSuccess: (res) => {
        console.log("✅ Respuesta backend:", res);
        const generatedTickets = res?.data?.ticketNumbers ?? [];
        setAssignedTickets(generatedTickets);
        setCurrentStep(4);
        toast({
          title: "Compra registrada",
          description: "Su compra ha sido registrada exitosamente.",
        });
      },

      onError: (err: unknown) => {
        // Mensaje genérico por defecto
        let msg = "Lo sentimos, la compra no pudo ser procesada.";

        try {
          const parsed = JSON.parse((err as Error).message);

          if (parsed.status === 409) {
            // Referencia duplicada
            msg =
              "Ese número de referencia ya fue usado. Verifica e intenta de nuevo.";
          } else if (parsed.body) {
            const body = JSON.parse(parsed.body);
            if (body && body.message) {
              // Anteponer "Lo sentimos, " al mensaje del servidor
              msg = `Lo sentimos, ${body.message}`;
            }
          }
        } catch {
          // Si falla el parseo, usamos el mensaje genérico
        }

        toast({
          title: "Error al enviar",
          description: msg,
          variant: "destructive",
        });
      },
    });
  };

  const handleViewTickets = () => {
    // This would navigate to a tickets view filtered by phone number
    toast({
      title: "Función disponible pronto",
      description: "La visualización de tickets estará disponible pronto.",
    });
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold luxury-text">
          Datos del Participante
        </h3>
        <p className="text-gray-600">Ingrese sus datos personales</p>
      </div>

      <div>
        <Label htmlFor="raffle">Selecciona un sorteo</Label>
        <Select
          value={selectedRaffle?._id || ""}
          onValueChange={(id) => {
            const raffle = raffles.find((r) => r._id === id) || null;
            setSelectedRaffle(raffle);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una rifa activa" />
          </SelectTrigger>
          <SelectContent>
            {raffles.map((raffle) => (
              <SelectItem key={raffle._id} value={raffle._id}>
                {raffle.title} — Bs. {raffle.ticketPrice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* --- NUEVO: Cantidad de boletos --- */}
      <div className="mt-4">
        <Label htmlFor="qty">Cantidad de boletos</Label>
        <div className="flex items-center gap-2 mt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocalTicketQuantity((q) => (q > 1 ? q - 1 : 1))}
          >
            -
          </Button>

          <Input
            id="qty"
            type="number"
            min={1}
            value={localTicketQuantity}
            onChange={(e) =>
              setLocalTicketQuantity(Math.max(1, Number(e.target.value)))
            }
            className="w-20 text-center"
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => setLocalTicketQuantity((q) => q + 1)}
          >
            +
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="fullName">Nombre Completo</Label>
        <Input
          id="fullName"
          value={userData.fullName}
          onChange={(e) =>
            setUserData({ ...userData, fullName: e.target.value })
          }
          placeholder="Ingrese su nombre completo"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="idType">Tipo</Label>
          <Select
            value={userData.idType}
            onValueChange={(value: "V" | "E") =>
              setUserData({ ...userData, idType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="V">V</SelectItem>
              <SelectItem value="E">E</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label htmlFor="idNumber">Número de Cédula</Label>
          <Input
            id="idNumber"
            value={userData.idNumber}
            onChange={(e) =>
              setUserData({ ...userData, idNumber: e.target.value })
            }
            placeholder="12345678"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          placeholder="04121234567"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          placeholder="correo@ejemplo.com"
          required
        />
      </div>

      <Button onClick={handleStep1Submit} className="w-full luxury-button">
        Continuar al Pago
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold luxury-text">
          Instrucciones de Pago
        </h3>
        <p className="text-gray-600">
          Complete el pago móvil en los siguientes datos
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <Clock className="h-6 w-6 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 font-semibold">
          Tiempo restante: {formatTime(timeLeft)}
        </p>
      </div>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Monto a Pagar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold luxury-text">
              Bs. {totalAmount.toFixed(2)}
            </div>

            {typeof usdRate === "number" && (
              <div className="text-sm text-gray-500 mt-1">
                ≈ ${(totalAmount / usdRate).toFixed(2)} (BCV)
              </div>
            )}

            <p className="text-gray-600">
              {localTicketQuantity} boleto(s) para {selectedRaffle?.title || ""}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Datos para Pago Móvil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Banco:</span>
            <span>Banesco (0134)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Teléfono:</span>
            <span>04127470479</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Cédula:</span>
            <span>V-31541350</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          1. Realice el pago móvil con los datos mostrados arriba
        </p>
        <p className="text-sm text-gray-600">
          2. Guarde el comprobante de pago
        </p>
        <p className="text-sm text-gray-600">
          3. Haga clic en "Continuar" para reportar el pago
        </p>
      </div>

      <Button onClick={handleStep2Continue} className="w-full luxury-button">
        Ya realicé el pago - Continuar
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold luxury-text">Reportar Pago</h3>
        <p className="text-gray-600">Ingrese los datos de su pago</p>
      </div>

      <div>
        <Label htmlFor="reference">Número de Referencia</Label>
        <Input
          id="reference"
          value={paymentData.reference}
          onChange={(e) =>
            setPaymentData({ ...paymentData, reference: e.target.value })
          }
          placeholder="Ingrese el número de referencia"
          required
        />
      </div>

      <div>
        <Label htmlFor="screenshot">Comprobante de Pago</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-2">Suba una foto del comprobante</p>
          <input
            type="file"
            id="screenshot"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="screenshot" className="cursor-pointer">
            <Button type="button" variant="outline" asChild>
              <span>Seleccionar Archivo</span>
            </Button>
          </label>
          {paymentData.screenshot && (
            <p className="text-green-600 mt-2">
              ✓ Archivo seleccionado: {paymentData.screenshot.name}
            </p>
          )}
        </div>
      </div>

      {/* … */}
      {/* 1) Checkbox de reconocimiento */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <label htmlFor="ackPending" className="flex items-start gap-2">
          <input
            type="checkbox"
            id="ackPending"
            checked={ackPending}
            onChange={(e) => setAckPending(e.target.checked)}
            className="mt-1"
          />
          <span className="text-yellow-800 text-sm">
            Entiendo que mi compra quedará{" "}
            <strong>Pendiente de verificación</strong> y se confirmará una vez
            que el pago haya sido recibido con éxito.
          </span>
        </label>
      </div>

      {/* 2) Botón deshabilitado hasta marcar el checkbox */}
      <Button
        onClick={handleStep3Submit}
        disabled={createPurchaseMutation.isPending || !ackPending}
        className="w-full luxury-button"
      >
        {createPurchaseMutation.isPending ? "Enviando..." : "Confirmar Compra"}
      </Button>
    </div>
  );

  // ─── renderStep4 definitivo ────────────────────────────────────────────────
  const renderStep4 = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold luxury-text">
            ¡Compra Confirmada!
          </h3>
          <p className="text-gray-600">
            Su compra ha sido registrada exitosamente
          </p>
        </div>

        <Card className="luxury-card">
          <CardHeader>
            <CardTitle>Números Asignados</CardTitle>
            <CardDescription>
              Sus números de la suerte para {selectedRaffle?.title || ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {assignedTickets.map((ticket, index) => (
                <Badge
                  key={index}
                  className="bg-green-500 text-white text-lg px-3 py-1"
                >
                  {ticket}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ——— Aviso amarillo de “Pendiente de verificación” ——— */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Estado:</strong> Pendiente de verificación
          </p>
          <p className="text-yellow-800 text-sm">
            Sus números serán confirmados una vez verifiquemos el pago.
          </p>
        </div>

        <div className="space-y-2">
          <Button onClick={onClose} className="w-full luxury-button">
            Ir al Inicio
          </Button>
          <Button
            onClick={handleViewTickets}
            variant="outline"
            className="w-full"
          >
            Ver Mis Números
          </Button>
        </div>
      </div>
    );
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <>
      {/* ——— Wizard Steps dentro del Dialog ——— */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {/* Aquí va tu DialogHeader y progress bar tal cual lo tenías */}
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="luxury-text">Comprar Números</span>
              </div>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === currentStep
                        ? "bg-[#D4AA7D] text-white"
                        : step < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">{getStepContent()}</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentWizard;
