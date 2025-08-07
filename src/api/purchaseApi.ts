// src/api/purchaseApi.ts

export const createPurchase = async (formData: FormData) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchases`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar la compra');
  }

  return response.json();
};
