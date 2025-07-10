// src/lib/api/purchase.ts

export interface Purchase {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  raffleId: {
    _id: string;
    title: string;
  };
  amount: number;
  ticketCount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: 'card' | 'transfer' | 'cash';
  createdAt: string;
  transactionId: string;
}

export const fetchAllPurchases = async (): Promise<Purchase[]> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/purchase`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener las compras");

  return res.json();
};
