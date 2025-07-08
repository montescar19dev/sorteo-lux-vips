
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import PaymentWizard from './PaymentWizard';

interface BuyTicketsButtonProps {
  raffleId: string;
  raffleTitle: string;
  ticketPrice: number;
  maxTickets?: number;
  disabled?: boolean;
}

const BuyTicketsButton: React.FC<BuyTicketsButtonProps> = ({
  raffleId,
  raffleTitle,
  ticketPrice,
  maxTickets = 10,
  disabled = false
}) => {
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [showPaymentWizard, setShowPaymentWizard] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxTickets) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyClick = () => {
    if (showQuantitySelector) {
      setShowPaymentWizard(true);
      setShowQuantitySelector(false);
    } else {
      setShowQuantitySelector(true);
    }
  };

  const totalAmount = ticketPrice * quantity;

  if (disabled) {
    return (
      <Button disabled className="w-full">
        Sorteo No Disponible
      </Button>
    );
  }

  return (
    <>
      {!showQuantitySelector ? (
        <Button onClick={handleBuyClick} className="w-full luxury-button">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Comprar Números
        </Button>
      ) : (
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="text-sm">Seleccionar Cantidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quantity">Cantidad de números</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                  min="1"
                  max={maxTickets}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= maxTickets}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-semibold luxury-text">
                Total: Bs. {totalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {quantity} número(s) × Bs. {ticketPrice.toFixed(2)}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowQuantitySelector(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleBuyClick}
                className="flex-1 luxury-button"
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <PaymentWizard
        isOpen={showPaymentWizard}
        onClose={() => {
          setShowPaymentWizard(false);
          setShowQuantitySelector(false);
        }}
        raffleTitle={raffleTitle}
        ticketPrice={ticketPrice}
        ticketQuantity={quantity}
      />
    </>
  );
};

export default BuyTicketsButton;
