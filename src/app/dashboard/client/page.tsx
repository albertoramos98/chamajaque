"use client";

import { useAuthStore } from "@/store/authStore";
import { useServiceStore } from "@/store/serviceStore";
import { MOCK_PROFESSIONALS } from "@/lib/mocks";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Calendar,
  Search,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ServiceStatus } from "@/types";

const statusConfig: Record<ServiceStatus, { label: string; color: string }> = {
  PENDING: { label: "Aguardando", color: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "Confirmado", color: "bg-blue-100 text-blue-700" },
  IN_PROGRESS: { label: "Em andamento", color: "bg-green-100 text-green-700" },
  COMPLETED: { label: "Finalizado", color: "bg-slate-100 text-slate-700" },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

import { useEffect, useState } from "react";

export default function ClientDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const requests = useServiceStore((state) => state.getRequestsByClient(user?.id || ""));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!user || user.role !== "CLIENT") {
    return redirect("/login");
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Olá, {user.name}! 👋</h1>
            <p className="text-slate-500">Acompanhe suas solicitações e agendamentos.</p>
          </div>
          <Link href="/request">
            <Button className="bg-orange-600 hover:bg-orange-700 rounded-full h-12 px-6 shadow-lg shadow-orange-200">
              <Plus className="w-5 h-5 mr-2" /> Nova Solicitação
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Requests List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Minhas Faxinas
            </h2>

            {requests.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-200 bg-transparent py-12 text-center">
                <CardContent className="space-y-4">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-lg">Você ainda não tem solicitações</p>
                    <p className="text-slate-500 max-w-xs mx-auto text-sm">Que tal agendar sua primeira faxina agora mesmo e ganhar tempo livre?</p>
                  </div>
                  <Link href="/request" className="inline-block">
                    <Button variant="outline" className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50">
                      Agendar agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {requests.slice().reverse().map((req) => {
                  const prof = MOCK_PROFESSIONALS.find(p => p.id === req.professionalId);
                  const config = statusConfig[req.status];

                  return (
                    <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Link href={`/service/${req.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                              <div className="flex gap-4">
                                <div className="bg-slate-100 p-3 rounded-2xl h-fit">
                                  <Clock className="w-6 h-6 text-slate-600" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">
                                      {req.scheduledDate} às {req.scheduledTime}
                                    </h3>
                                    <Badge className={`${config.color} border-none`}>{config.label}</Badge>
                                  </div>
                                  <div className="text-sm text-slate-500 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {req.address.neighborhood}, {req.address.city}
                                  </div>
                                  <p className="text-xs text-slate-400">
                                    {req.details.propertyType} • {req.details.size}m² • {req.details.cleaningLevel}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-none pt-4 md:pt-0">
                                {prof ? (
                                  <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                      <p className="text-xs text-slate-400 font-medium">Profissional</p>
                                      <p className="text-sm font-bold">{prof.name.split(' ')[0]}</p>
                                    </div>
                                    <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                      <AvatarImage src={prof.avatar} />
                                      <AvatarFallback>{prof.name[0]}</AvatarFallback>
                                    </Avatar>
                                  </div>
                                ) : (
                                  <div className="text-sm text-amber-600 font-medium flex items-center gap-1">
                                    Procurando profissional...
                                  </div>
                                )}
                                <div className="text-right">
                                  <p className="text-xs text-slate-400 font-medium uppercase">Valor</p>
                                  <p className="text-lg font-bold text-orange-600">R$ {req.estimatedValue}</p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs text-slate-400">
                               <span>ID: #{req.id}</span>
                               <span className="flex items-center gap-1 group-hover:text-orange-600 font-bold transition-colors">
                                 Ver detalhes <ChevronRight className="w-4 h-4" />
                               </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Column: Profile & Stats */}
          <div className="space-y-6">
            <Card className="bg-white shadow-sm border-none">
              <CardHeader className="text-center pb-2">
                <Avatar className="w-20 h-20 mx-auto border-4 border-orange-50 mb-2">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>Cliente desde 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl text-center">
                    <p className="text-xl font-bold">{requests.length}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Serviços</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl text-center">
                    <p className="text-xl font-bold">5.0</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Média</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-full">Editar Perfil</Button>
              </CardContent>
            </Card>

            <div className="bg-orange-600 p-8 rounded-3xl text-white space-y-4 shadow-xl shadow-orange-100">
               <h3 className="text-xl font-bold leading-tight">Ganhe R$20 de desconto!</h3>
               <p className="text-orange-100 text-sm">Indique a Jaque para um amigo e ambos ganham créditos na próxima faxina.</p>
               <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-full">Indicar agora</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
