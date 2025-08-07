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
  ArrowDown,
  Copy,
  Clipboard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Raffle } from "@/types/Raffle";

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

  const [errors, setErrors] = useState<{
    fullName?: string;
    idNumber?: string;
    phone?: string;
    email?: string;
    qty?: string;
    raffle?: string;
    reference?: string;
    screenshot?: string;
  }>({});

  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    idType: "V",
    idNumber: "",
    phone: "",
    email: "",
  });

  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [localTicketQuantity, setLocalTicketQuantity] = useState<number>(1);

  useEffect(() => {
    if (initialRaffle) {
      setSelectedRaffle(initialRaffle);
      setLocalTicketQuantity(initialRaffle.minTicketsPerUser || 1);
    }
  }, [initialRaffle]);

  useEffect(() => {
    if (selectedRaffle) {
      setLocalTicketQuantity(selectedRaffle.minTicketsPerUser || 1);
    }
  }, [selectedRaffle]);

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
    if (currentStep === 2 && timeLeft === 300) {
      // Iniciar temporizador en paso 2
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (currentStep === 3 && timeLeft === 300) {
      // Iniciar temporizador en paso 3
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft > 0 && (currentStep === 2 || currentStep === 3)) {
      // Continuar contando en paso 2 o 3
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && (currentStep === 2 || currentStep === 3)) {
      toast({
        title: "Tiempo agotado",
        description:
          currentStep === 2
            ? "El tiempo para completar el pago ha expirado."
            : "El tiempo para reportar el pago ha expirado.",
        variant: "destructive",
      });
      onClose();
    }
  }, [currentStep, timeLeft, onClose, toast]);

  // Obtener tasa BCV al montar
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rates/usd-bcv`);
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: `${label} copiado`,
          description: `${text} ha sido copiado al portapapeles.`,
        });
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
        toast({
          title: "Error",
          description: "No se pudo copiar al portapapeles.",
          variant: "destructive",
        });
      });
  };

  const pasteFromClipboard = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setPaymentData({ ...paymentData, reference: text });
        setErrors((prev) => ({ ...prev, reference: undefined }));
        toast({
          title: "Referencia pegada",
          description: "El número de referencia ha sido pegado correctamente.",
        });
      })
      .catch((err) => {
        console.error("Error al pegar desde el portapapeles:", err);
        toast({
          title: "Error",
          description: "No se pudo pegar desde el portapapeles.",
          variant: "destructive",
        });
      });
  };

  const handleStep1Submit = () => {
    const newErrors: typeof errors = {};
    let hasError = false;

    if (!selectedRaffle) {
      newErrors.raffle = "Por favor seleccione una rifa.";
      hasError = true;
    }
    if (!userData.fullName) {
      newErrors.fullName = "El nombre completo es obligatorio.";
      hasError = true;
    }
    if (!userData.idNumber) {
      newErrors.idNumber = "El número de cédula es obligatorio.";
      hasError = true;
    }
    if (!userData.phone) {
      newErrors.phone = "El teléfono es obligatorio.";
      hasError = true;
    }
    if (!userData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
      hasError = true;
    }
    if (localTicketQuantity < (selectedRaffle?.minTicketsPerUser || 1)) {
      newErrors.qty = `Debe seleccionar al menos ${selectedRaffle?.minTicketsPerUser} boleto(s).`;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos correctamente.",
        variant: "destructive",
      });
      return;
    }

    setErrors({});
    setCurrentStep(2);
  };

  const handleStep2Continue = () => {
    setTimeLeft(300); // Reiniciar temporizador a 5 minutos
    setCurrentStep(3);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentData({ ...paymentData, screenshot: file });
    }
  };

  const handleStep3Submit = () => {
    const newErrors: typeof errors = {};
    let hasError = false;

    if (!paymentData.reference) {
      newErrors.reference = "El número de referencia es obligatorio.";
      hasError = true;
    }
    if (!paymentData.screenshot) {
      newErrors.screenshot = "Debe subir un comprobante de pago.";
      hasError = true;
    }
    if (!selectedRaffle) {
      newErrors.raffle = "No se ha seleccionado una rifa.";
      hasError = true;
    }
    if (localTicketQuantity < (selectedRaffle?.minTicketsPerUser || 1)) {
      newErrors.qty = `Debe seleccionar al menos ${selectedRaffle?.minTicketsPerUser} boleto(s).`;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      toast({
        title: "Datos incompletos",
        description: "Por favor complete todos los campos correctamente.",
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
        setErrors({});
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
            setErrors((prev) => ({ ...prev, raffle: undefined }));
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
        {errors.raffle && (
          <p className="text-red-500 text-sm mt-1">{errors.raffle}</p>
        )}
      </div>

      <div className="mt-4">
        <Label htmlFor="qty">Cantidad de boletos</Label>
        <div className="flex items-center gap-2 mt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setLocalTicketQuantity((q) =>
                q > (selectedRaffle?.minTicketsPerUser || 1) ? q - 1 : q
              )
            }
            disabled={
              localTicketQuantity <= (selectedRaffle?.minTicketsPerUser || 1)
            }
          >
            -
          </Button>

          <Input
            id="qty"
            type="number"
            min={selectedRaffle?.minTicketsPerUser || 1}
            value={localTicketQuantity}
            onChange={(e) => {
              setLocalTicketQuantity(
                Math.max(
                  selectedRaffle?.minTicketsPerUser || 1,
                  Number(e.target.value)
                )
              );
              setErrors((prev) => ({ ...prev, qty: undefined }));
            }}
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
        {selectedRaffle?.minTicketsPerUser > 1 && (
          <p className="text-sm text-gray-500 mt-1">
            Mínimo {selectedRaffle.minTicketsPerUser} boleto(s) para esta rifa.
          </p>
        )}
        {errors.qty && (
          <p className="text-red-500 text-sm mt-1">{errors.qty}</p>
        )}
      </div>

      <div>
        <Label htmlFor="fullName">Nombre Completo</Label>
        <Input
          id="fullName"
          value={userData.fullName}
          onChange={(e) => {
            setUserData({ ...userData, fullName: e.target.value });
            setErrors((prev) => ({ ...prev, fullName: undefined }));
          }}
          placeholder="Ingrese su nombre completo"
          required
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
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
            onChange={(e) => {
              setUserData({ ...userData, idNumber: e.target.value });
              setErrors((prev) => ({ ...prev, idNumber: undefined }));
            }}
            placeholder="12345678"
            required
          />
          {errors.idNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          value={userData.phone}
          onChange={(e) => {
            setUserData({ ...userData, phone: e.target.value });
            setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          placeholder="04121234567"
          required
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          value={userData.email}
          onChange={(e) => {
            setUserData({ ...userData, email: e.target.value });
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="correo@ejemplo.com"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
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
          Completa el pago móvil con los siguientes datos:
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
          <div className="text-center space-y-3">
            <p className="text-gray-600">
              <strong>
                Precio por boleto: Bs.{" "}
                {selectedRaffle?.ticketPrice.toFixed(2) || "0.00"}
              </strong>
            </p>
            <p className="text-gray-600">
              <strong>{localTicketQuantity} ticket(s)</strong> para{" "}
              {selectedRaffle?.title || ""}
            </p>
            <hr className="border-gray-300" />
            <div>
              <p className="text-lg font-semibold text-gray-600">
                Total a pagar:
              </p>
              <div className="text-3xl font-bold luxury-text">
                Bs. {totalAmount.toFixed(2)}
              </div>
              {typeof usdRate === "number" && (
                <div className="text-sm text-gray-500 mt-1">
                  ≈ ${(totalAmount / usdRate).toFixed(2)} (BCV)
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-700 font-semibold">
          ¡Asegúrate de pagar el monto exacto que te indicamos. De lo contrario
          no podremos validar la información.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600 flex items-center gap-1">
          1. Realiza el pago móvil con los datos mostrados a continuación:
          <ArrowDown className="h-4 w-4" />
        </p>
        <p className="text-sm text-gray-600">
          2. Guarde el comprobante de pago. (captura de pantalla)
        </p>
        <p className="text-sm text-gray-600">
          3. Haga clic en "Continuar" para reportar el pago
        </p>
      </div>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Datos para Pago Móvil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Banco:</span>
            <span>Banesco (0134)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Teléfono:</span>
            <div className="flex items-center gap-2">
              <span>04248592770</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("04248592770", "Teléfono")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Cédula:</span>
            <div className="flex items-center gap-2">
              <span>V-7525076</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("7525076", "Cédula")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <Clock className="h-6 w-6 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 font-semibold">
          Tiempo restante: {formatTime(timeLeft)}
        </p>
      </div>

      <div>
        <Label htmlFor="reference">Número de Referencia</Label>
        <div className="flex items-center gap-2">
          <Input
            id="reference"
            value={paymentData.reference}
            onChange={(e) => {
              setPaymentData({ ...paymentData, reference: e.target.value });
              setErrors((prev) => ({ ...prev, reference: undefined }));
            }}
            placeholder="Ingrese el número de referencia"
            required
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={pasteFromClipboard}
            title="Pegar desde el portapapeles"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        </div>
        {errors.reference && (
          <p className="text-red-500 text-sm mt-1">{errors.reference}</p>
        )}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2 text-center">
          <p className="text-red-700 font-semibold">
            Asegúrate de escribir todos los caracteres del número de referencia.
          </p>
        </div>
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
            onChange={(e) => {
              handleFileUpload(e);
              setErrors((prev) => ({ ...prev, screenshot: undefined }));
            }}
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
          {errors.screenshot && (
            <p className="text-red-500 text-sm mt-1">{errors.screenshot}</p>
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
                        ? "bg-[#FFD700] text-white"
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
