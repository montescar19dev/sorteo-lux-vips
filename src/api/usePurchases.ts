import { useQuery } from "@tanstack/react-query";
import { Purchase } from "@/types/Purchase";

export const usePurchases = (token: string | null) => {
  console.log("🔎 usePurchases token recibido:", token);

  return useQuery<Purchase[]>({
  queryKey: ["purchases", token],
  queryFn: async () => {
    console.log("📡 Fetch ejecutado con token:", token);

    const response = await fetch("http://localhost:5000/api/purchases", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text(); // para debug
      console.error("⚠️ Error en fetch de compras:", response.status, text);
      throw new Error("Error al cargar las compras");
    }

    return response.json();
  },
  enabled: !!token,
  retry: false, // ❌ evita los reintentos infinitos
  });
};

import axios from "axios";

export const updatePurchaseStatus = async (
  id: string,
  status: "pending" | "verified" | "rejected",
  token: string
): Promise<Purchase> => {
  const response = await axios.patch(
    `${import.meta.env.VITE_API_URL}/api/purchases/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.purchase;
};
