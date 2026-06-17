"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useServiceStore } from "@/store/serviceStore";
import { MOCK_PROFESSIONALS } from "@/lib/mocks";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  Clock,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

import { Suspense, useState, useEffect } from "react";

function MatchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = searchParams.get("id");
  const { fetchRequestById, assignProfessional } = useServiceStore();
  const [request, setRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequest = async () => {
      if (requestId) {
        const data = await fetchRequestById(requestId);
        setRequest(data);
      }
      setIsLoading(false);
    };
    loadRequest();
  }, [requestId, fetchRequestById]);

  const handleChoose = async (profId: string, profName: string) => {
    if (!requestId) return;
    await assignProfessional(requestId, profId);
    toast.success(`Você escolheu a ${profName}! Ela foi notificada.`);
    router.push(`/dashboard/client`);
  };

  if (isLoading) return <div className="p-20 text-center text-slate-500 font-medium">Buscando detalhes do seu pedido...</div>;

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Solicitação não encontrada.</h2>
        <Button onClick={() => router.push("/request")} className="mt-4">Fazer novo pedido</Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold">Encontramos ótimas opções para você!</h1>
          <p className="text-slate-500">Selecione a profissional que melhor atende suas necessidades.</p>
        </div>

        {/* Request Summary Card */}
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-bold">{request.scheduledDate} às {request.scheduledTime}</p>
                <p className="text-xs text-slate-500">{request.details.propertyType} • {request.details.size}m² • {request.details.cleaningLevel}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Valor Sugerido</p>
              <p className="text-xl font-bold text-orange-600">R$ {request.estimatedValue}</p>
            </div>
          </CardContent>
        </Card>

        {/* Professionals List */}
        <div className="space-y-4">
          {MOCK_PROFESSIONALS.map((prof, index) => (
            <motion.div
              key={prof.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow border-none overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 bg-slate-100/50 p-6 flex flex-col items-center justify-center text-center space-y-3">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-sm">
                        <AvatarImage src={prof.avatar} />
                        <AvatarFallback>{prof.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{prof.name}</h3>
                        <div className="flex items-center justify-center gap-1 text-orange-500">
                          <Star className="w-4 h-4 fill-orange-500" />
                          <span className="text-sm font-bold">{prof.rating}</span>
                          <span className="text-xs text-slate-400 font-normal">({prof.completedJobs})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-3/4 p-6 space-y-4 relative">
                      <div className="flex flex-wrap gap-2">
                         {prof.specialties.map(s => (
                           <Badge key={s} variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-none">
                             {s}
                           </Badge>
                         ))}
                         {index === 0 && (
                           <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex gap-1 items-center">
                             <Sparkles className="w-3 h-3" /> Mais Próxima
                           </Badge>
                         )}
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                        {prof.bio}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {prof.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                          Perfil Verificado
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-slate-900">R$ {prof.basePricePerHour}</span>
                          <span className="text-xs text-slate-400">/ hora</span>
                        </div>
                        <Button 
                          onClick={() => handleChoose(prof.id, prof.name)}
                          className="bg-orange-600 hover:bg-orange-700 rounded-full px-6 group-hover:translate-x-1 transition-transform"
                        >
                          Escolher {prof.name.split(' ')[0]} <ChevronRight className="ml-1 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
          <p className="text-slate-500 font-medium">Não encontrou quem procurava?</p>
          <p className="text-sm text-slate-400">Estamos sempre cadastrando novas profissionais qualificadas para melhor atendê-lo.</p>
        </div>
      </div>
    </div>
  );
}

export default function MatchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Carregando profissionais...</div>}>
      <MatchContent />
    </Suspense>
  );
}
