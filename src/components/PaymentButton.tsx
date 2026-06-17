"use client";

import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Inicializa o Mercado Pago com a chave pública
if (typeof window !== "undefined") {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || "");
}

interface PaymentButtonProps {
  serviceId: string;
  title: string;
  price: number;
}

export default function PaymentButton({ serviceId, title, price }: PaymentButtonProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePreference = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: serviceId,
          title: title,
          price: price,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.id) {
        setPreferenceId(data.id);
      } else {
        throw new Error(data.error || "Falha ao gerar pagamento");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Não foi possível gerar o link de pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (preferenceId) {
    return (
      <div className="w-full">
        <Wallet 
          initialization={{ preferenceId }} 
          customization={{ texts: { valueProp: 'smart_option' } }} 
        />
      </div>
    );
  }

  return (
    <Button 
      onClick={handleCreatePreference} 
      disabled={isLoading}
      className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-bold shadow-lg shadow-blue-100 transition-all"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Gerando Pagamento...
        </>
      ) : (
        "Pagar com Mercado Pago"
      )}
    </Button>
  );
}
