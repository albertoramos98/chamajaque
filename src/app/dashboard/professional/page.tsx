"use client";

import { useAuthStore } from "@/store/authStore";
import { useServiceStore } from "@/store/serviceStore";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DollarSign, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Calendar,
  Star,
  ArrowUpRight,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";

export default function ProfessionalDashboard() {
  const user = useAuthStore((state) => state.user);
  const { requests, isLoading, fetchAvailableRequests, fetchRequestsByClient } = useServiceStore();
  
  useEffect(() => {
    if (user) {
      fetchAvailableRequests();
      // Em um app real, buscaríamos os aceitos por esse profissional especificamente
    }
  }, [user, fetchAvailableRequests]);

  if (isLoading) return <div className="p-20 text-center">Carregando oportunidades...</div>;

  if (!user || user.role !== "PROFESSIONAL") {
    return redirect("/login");
  }

  const myServices = requests.filter(r => r.professionalId === user.id);
  const availableJobs = requests.filter(r => !r.professionalId && r.status === 'PENDING');

  const totalEarnings = myServices.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Bom dia, {user.name}! ☀️</h1>
            <p className="text-slate-500">Pronta para mais um dia de sucesso?</p>
          </div>
          <div className="flex gap-4">
            <Card className="bg-white px-6 py-3 border-none shadow-sm flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Ganhos do Mês</p>
                <p className="text-lg font-bold">R$ {totalEarnings.toFixed(2)}</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Disponíveis agora */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-orange-600" />
                Serviços Disponíveis para você
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableJobs.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">Não há novos serviços na sua região no momento.</p>
                ) : (
                  availableJobs.map(job => (
                    <Card key={job.id} className="border-orange-100 bg-orange-50/20 hover:border-orange-300 transition-colors">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold">{job.scheduledDate}</p>
                            <p className="text-sm text-slate-500">{job.scheduledTime} • ~{job.estimatedDuration}h</p>
                          </div>
                          <p className="text-xl font-bold text-orange-600">R$ {job.estimatedValue}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" /> {job.address.neighborhood}
                        </div>
                        <Link href={`/service/${job.id}`}>
                          <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-full mt-2">
                            Ver Detalhes
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>

            {/* Minha Agenda */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Minha Agenda
              </h2>
              <div className="space-y-3">
                {myServices.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">Você ainda não aceitou nenhum serviço.</p>
                ) : (
                  myServices.map(service => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl">
                              <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                               <p className="font-bold">{service.scheduledDate} às {service.scheduledTime}</p>
                               <p className="text-xs text-slate-500">{service.address.street}, {service.address.number}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <Badge className={service.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'}>
                              {service.status}
                            </Badge>
                            <Link href={`/service/${service.id}`}>
                              <Button variant="ghost" size="icon"><ArrowUpRight className="w-5 h-5" /></Button>
                            </Link>
                         </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white shadow-sm border-none overflow-hidden">
               <div className="bg-orange-600 h-20"></div>
               <div className="px-6 pb-6 -mt-10 text-center space-y-4">
                  <Avatar className="w-20 h-20 mx-auto border-4 border-white">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user.name}</CardTitle>
                    <div className="flex items-center justify-center gap-1 text-orange-500 mt-1">
                      <Star className="w-4 h-4 fill-orange-500" />
                      <span className="text-sm font-bold">4.9</span>
                      <span className="text-xs text-slate-400 font-normal">(124 serviços)</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t grid grid-cols-2 gap-4">
                     <div className="text-center">
                        <p className="font-bold">12</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Este Mês</p>
                     </div>
                     <div className="text-center">
                        <p className="font-bold">98%</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Sucesso</p>
                     </div>
                  </div>
                  <Button variant="outline" className="w-full rounded-full mt-4">Configurações</Button>
               </div>
            </Card>

            <div className="bg-blue-600 p-8 rounded-3xl text-white space-y-4">
               <h3 className="text-xl font-bold leading-tight">Dica da Jaque 💡</h3>
               <p className="text-blue-100 text-sm">Sempre confirme o endereço com o cliente via chat antes de sair de casa para evitar imprevistos.</p>
               <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-full">Ver mais dicas</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
