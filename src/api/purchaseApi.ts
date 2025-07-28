// src/api/purchaseApi.ts

export const createPurchase = async (formData: FormData) => {
  const response = await fetch("http://localhost:5000/api/purchases", {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar la compra');
  }

  return response.json();
};
