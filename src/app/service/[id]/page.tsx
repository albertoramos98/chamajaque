"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useServiceStore } from "@/store/serviceStore";
import { MOCK_PROFESSIONALS } from "@/lib/mocks";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  ArrowLeft,
  Calendar,
  User as UserIcon,
  ShieldCheck,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { ServiceStatus } from "@/types";

export default function ServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const getRequestById = useServiceStore((state) => state.getRequestById);
  const updateStatus = useServiceStore((state) => state.updateStatus);
  const assignProfessional = useServiceStore((state) => state.assignProfessional);

  const service = getRequestById(id as string);
  const prof = MOCK_PROFESSIONALS.find(p => p.id === service?.professionalId);

  if (!service) return <div className="p-20 text-center">Serviço não encontrado.</div>;

  const isClient = user?.role === 'CLIENT';
  const isProf = user?.role === 'PROFESSIONAL';

  const handleAccept = () => {
    if (user) {
      assignProfessional(service.id, user.id);
      toast.success("Você aceitou este serviço! Prepare seus materiais.");
    }
  };

  const handleStart = () => {
    updateStatus(service.id, 'IN_PROGRESS');
    toast.info("Serviço iniciado! Bom trabalho.");
  };

  const handleFinish = () => {
    updateStatus(service.id, 'COMPLETED');
    toast.success("Serviço finalizado com sucesso! O cliente será notificado.");
    router.push('/dashboard/professional');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
               <div className="bg-orange-600 p-6 text-white flex justify-between items-center">
                  <div>
                    <p className="text-orange-100 text-xs font-bold uppercase tracking-wider">Status do Serviço</p>
                    <h2 className="text-2xl font-bold">{service.status}</h2>
                  </div>
                  <Badge className="bg-white/20 text-white border-none text-lg py-1 px-4">
                    #{service.id}
                  </Badge>
               </div>
               <CardContent className="p-8 space-y-6">
                  <div className="flex flex-wrap gap-8">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 font-bold uppercase">Data e Hora</p>
                      <div className="flex items-center gap-2 font-bold">
                        <Calendar className="w-4 h-4 text-orange-600" /> {service.scheduledDate}
                      </div>
                      <div className="flex items-center gap-2 font-bold">
                        <Clock className="w-4 h-4 text-orange-600" /> {service.scheduledTime}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 font-bold uppercase">Localização</p>
                      <div className="flex items-center gap-2 font-bold">
                        <MapPin className="w-4 h-4 text-orange-600" /> {service.address.neighborhood}
                      </div>
                      <p className="text-xs text-slate-500 pl-6">{service.address.street}, {service.address.number}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t space-y-4">
                     <h3 className="font-bold">Checklist do Serviço</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.checklist?.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                            <Checkbox id={`item-${idx}`} checked={item.completed || service.status === 'COMPLETED'} />
                            <label htmlFor={`item-${idx}`} className="text-sm font-medium leading-none">
                              {item.item}
                            </label>
                          </div>
                        ))}
                     </div>
                  </div>

                  {isProf && service.status === 'IN_PROGRESS' && (
                    <div className="pt-6 border-t space-y-4">
                       <h3 className="font-bold">Registro Fotográfico (Opcional)</h3>
                       <div className="flex gap-4">
                          <Button variant="outline" className="h-24 w-1/2 flex flex-col gap-2 border-dashed border-2">
                             <Camera className="w-6 h-6 text-slate-400" />
                             <span className="text-xs">Foto Antes</span>
                          </Button>
                          <Button variant="outline" className="h-24 w-1/2 flex flex-col gap-2 border-dashed border-2">
                             <Camera className="w-6 h-6 text-slate-400" />
                             <span className="text-xs">Foto Depois</span>
                          </Button>
                       </div>
                    </div>
                  )}
               </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="bg-green-50 border-green-100">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-4 h-4" /> Inclusos na Faxina
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-green-800 space-y-1">
                     <p>• Limpeza de todos os cômodos</p>
                     <p>• Aspiração e pano no chão</p>
                     <p>• Limpeza de banheiros e cozinha</p>
                     <p>• Retirada de lixo</p>
                  </CardContent>
               </Card>
               <Card className="bg-amber-50 border-amber-100">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                        <AlertCircle className="w-4 h-4" /> Não Inclusos
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-amber-800 space-y-1">
                     <p>• Limpeza de vidros externos</p>
                     <p>• Limpeza de teto e lustres</p>
                     <p>• Remoção de mofo pesado</p>
                     <p>• Cuidar de animais/plantas</p>
                  </CardContent>
               </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
               <CardHeader>
                  <CardTitle className="text-lg">Informações Adicionais</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="flex justify-between items-end border-b pb-4">
                    <span className="text-slate-500 font-medium">Valor Estimado</span>
                    <span className="text-2xl font-bold text-orange-600">R$ {service.estimatedValue}</span>
                  </div>

                  {prof ? (
                    <div className="space-y-4">
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sua Profissional</p>
                       <div className="flex items-center gap-3">
                          <img src={prof.avatar} className="w-12 h-12 rounded-full border-2 border-orange-100" />
                          <div>
                             <p className="font-bold">{prof.name}</p>
                             <div className="flex items-center gap-1 text-orange-500 text-xs">
                                <Star className="w-3 h-3 fill-orange-500" /> {prof.rating}
                             </div>
                          </div>
                       </div>
                       <Button variant="outline" className="w-full rounded-full gap-2">
                          Conversar no Chat
                       </Button>
                    </div>
                  ) : (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                      <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Estamos aguardando uma profissional aceitar seu pedido. Você será notificado assim que houver um match!
                      </p>
                    </div>
                  )}
               </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
               {isProf && service.status === 'PENDING' && (
                 <Button onClick={handleAccept} className="w-full h-14 bg-orange-600 hover:bg-orange-700 rounded-full text-lg font-bold shadow-lg shadow-orange-100">
                    Aceitar Serviço
                 </Button>
               )}
               {isProf && service.status === 'ACCEPTED' && (
                 <Button onClick={handleStart} className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-bold">
                    Iniciar Faxina agora
                 </Button>
               )}
               {isProf && service.status === 'IN_PROGRESS' && (
                 <Button onClick={handleFinish} className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-full text-lg font-bold">
                    Finalizar Serviço
                 </Button>
               )}
               {isClient && service.status === 'COMPLETED' && (
                  <Button className="w-full h-14 bg-orange-600 hover:bg-orange-700 rounded-full text-lg font-bold">
                    Avaliar Serviço
                  </Button>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
