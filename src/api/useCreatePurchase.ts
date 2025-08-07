import { useMutation } from "@tanstack/react-query";

interface PurchasePayload {
  fullName: string;
  phoneNumber: string;
  raffleId: string;
  amount: number;
  ticketCount: number;
  paymentMethod: string;
  status: string;
  transactionId: string;
  screenshot: File; // asegurarnos que llega un File
}

export const useCreatePurchase = () => {
  return useMutation({
    mutationFn: async (payload: PurchasePayload) => {
      const formData = new FormData();

      // Campos texto / numéricos (convertidos a string explícitamente)
      formData.append("fullName", payload.fullName);
      formData.append("phoneNumber", payload.phoneNumber);
      formData.append("raffleId", payload.raffleId);
      formData.append("amount", String(payload.amount));
      formData.append("ticketCount", String(payload.ticketCount));
      formData.append("paymentMethod", payload.paymentMethod);
      formData.append("status", payload.status);
      formData.append("transactionId", payload.transactionId);

      // Imagen (nombre del campo a confirmar con multer)
      formData.append("screenshot", payload.screenshot);

      // Debug local antes de enviar
      // (No dejar en producción)
      console.log("🚀 Enviando FormData:");
      for (const [k, v] of formData.entries()) {
        console.log("   ", k, v);
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchases`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("⛔ Error en la compra:", text);
        // pasa el status para manejarlo arriba
        throw new Error(
          JSON.stringify({ status: response.status, body: text })
        );
      }

      return response.json();
    },
  });
};
