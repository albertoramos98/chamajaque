"use client";

import { useState, useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";

export function LGPDBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Checa se o usuário já consentiu nesta sessão/browser
    const hasConsented = localStorage.getItem("chamajaque_lgpd_consent");
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("chamajaque_lgpd_consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl">
      <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-primary/20 p-2 rounded-full hidden sm:block">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div className="text-sm space-y-1">
            <p className="font-bold text-base">Sua privacidade é nossa prioridade.</p>
            <p className="text-slate-300 leading-relaxed max-w-3xl">
              Em conformidade com a LGPD, utilizamos cookies e criptografia de ponta a ponta para proteger seus dados pessoais e documentos. 
              Nenhuma informação sensível é compartilhada sem o seu consentimento explícito, e os acessos a perfis profissionais são temporários e rastreados.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <Button onClick={handleAccept} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-8">
            Entendi e Aceito
          </Button>
          <button onClick={() => setIsVisible(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
             <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
