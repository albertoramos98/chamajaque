"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useServiceStore, calculateServiceEstimate } from "@/store/serviceStore";
import { ServiceDetails, Address, PropertyType, CleaningLevel } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Home, 
  Building2, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Sparkles,
  Clock,
  Calendar,
  MapPin,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function RequestPage() {
  const router = useRouter();
  const addRequest = useServiceStore((state) => state.addRequest);

  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<ServiceDetails>({
    propertyType: 'APARTMENT',
    size: 50,
    rooms: 1,
    bathrooms: 1,
    cleaningLevel: 'MEDIUM',
    hasPets: false,
    hasOutdoorArea: false,
    additionalServices: [],
    observations: "",
  });

  const [address, setAddress] = useState<Address>({
    street: "",
    number: "",
    neighborhood: "",
    city: "São Paulo",
    state: "SP",
    zipCode: "",
  });

  const [schedule, setSchedule] = useState({
    date: "",
    time: "",
  });

  const estimate = useMemo(() => calculateServiceEstimate(details), [details]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (!address.street || !address.number || !schedule.date || !schedule.time) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    const id = addRequest(details, address, schedule.date, schedule.time);
    toast.success("Solicitação criada com sucesso!");
    router.push(`/match?id=${id}`);
  };

  const toggleAdditional = (service: string) => {
    setDetails(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter(s => s !== service)
        : [...prev.additionalServices, service]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Solicitar Faxina</h1>
            <p className="text-slate-500">Passo {step} de 3 — {step === 1 ? 'Sobre o imóvel' : step === 2 ? 'Endereço e Data' : 'Revisão'}</p>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "33%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      Tipo de Imóvel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'APARTMENT', label: 'Apartamento', icon: <Building2 className="w-6 h-6" /> },
                      { id: 'HOUSE', label: 'Casa', icon: <Home className="w-6 h-6" /> },
                      { id: 'COMMERCIAL', label: 'Comercial', icon: <Building2 className="w-6 h-6" /> },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setDetails(d => ({ ...d, propertyType: type.id as PropertyType }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          details.propertyType === type.id 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-slate-100 hover:border-primary/20 text-slate-500'
                        }`}
                      >
                        {type.icon}
                        <span className="text-sm font-bold">{type.label}</span>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Detalhes e Tamanho</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Metragem aprox. (m²)</Label>
                        <Input 
                          type="number" 
                          value={details.size} 
                          onChange={e => setDetails(d => ({ ...d, size: Number(e.target.value) }))} 
                          className="h-12 border-slate-200 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nível da Limpeza</Label>
                        <Select 
                          value={details.cleaningLevel} 
                          onValueChange={v => setDetails(d => ({ ...d, cleaningLevel: v as CleaningLevel }))}
                        >
                          <SelectTrigger className="h-12 border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LIGHT">Leve (Manutenção)</SelectItem>
                            <SelectItem value="MEDIUM">Média (Padrão)</SelectItem>
                            <SelectItem value="HEAVY">Pesada (Profunda)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Quartos</Label>
                        <div className="flex items-center gap-4">
                          <Button variant="outline" size="icon" className="rounded-full w-10 h-10" onClick={() => setDetails(d => ({ ...d, rooms: Math.max(0, d.rooms - 1) }))}>-</Button>
                          <span className="font-bold w-4 text-center text-lg">{details.rooms}</span>
                          <Button variant="outline" size="icon" className="rounded-full w-10 h-10" onClick={() => setDetails(d => ({ ...d, rooms: d.rooms + 1 }))}>+</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Banheiros</Label>
                        <div className="flex items-center gap-4">
                          <Button variant="outline" size="icon" className="rounded-full w-10 h-10" onClick={() => setDetails(d => ({ ...d, bathrooms: Math.max(1, d.bathrooms - 1) }))}>-</Button>
                          <span className="font-bold w-4 text-center text-lg">{details.bathrooms}</span>
                          <Button variant="outline" size="icon" className="rounded-full w-10 h-10" onClick={() => setDetails(d => ({ ...d, bathrooms: d.bathrooms + 1 }))}>+</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Serviços Adicionais</CardTitle>
                    <CardDescription>Turbine sua limpeza com tarefas extras</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'washing', label: 'Lavar Roupa' },
                      { id: 'ironing', label: 'Passar Roupa' },
                      { id: 'cooking', label: 'Cozinhar' },
                      { id: 'heavy', label: 'Limpeza de Geladeira' },
                      { id: 'post_construction', label: 'Pós-obra' },
                    ].map((s) => (
                      <div key={s.id} className="flex items-center space-x-3 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                        <Checkbox 
                          id={s.id} 
                          checked={details.additionalServices.includes(s.id)}
                          onCheckedChange={() => toggleAdditional(s.id)}
                          className="w-5 h-5"
                        />
                        <label htmlFor={s.id} className="text-sm font-semibold leading-none cursor-pointer">
                          {s.label}
                        </label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleNext} className="bg-primary hover:opacity-90 h-14 px-10 rounded-full text-lg font-bold shadow-xl shadow-primary/20">
                    Próximo Passo <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Onde e Quando?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 md:col-span-1 space-y-2">
                        <Label>CEP</Label>
                        <Input placeholder="00000-000" className="h-12" value={address.zipCode} onChange={e => setAddress(a => ({ ...a, zipCode: e.target.value }))} />
                      </div>
                      <div className="col-span-2 md:col-span-1 space-y-2">
                        <Label>Logradouro</Label>
                        <Input placeholder="Rua, Avenida..." className="h-12" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Número</Label>
                        <Input value={address.number} className="h-12" onChange={e => setAddress(a => ({ ...a, number: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Bairro</Label>
                        <Input value={address.neighborhood} className="h-12" onChange={e => setAddress(a => ({ ...a, neighborhood: e.target.value }))} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Input type="date" className="h-12" value={schedule.date} onChange={e => setSchedule(s => ({ ...s, date: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Horário de Início</Label>
                        <Input type="time" className="h-12" value={schedule.time} onChange={e => setSchedule(s => ({ ...s, time: e.target.value }))} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={handleBack} className="h-14 px-10 rounded-full font-bold">Voltar</Button>
                  <Button onClick={handleNext} className="bg-primary hover:opacity-90 h-14 px-10 rounded-full text-lg font-bold shadow-xl shadow-primary/20">
                    Revisar Pedido <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border-none shadow-lg bg-primary/5">
                  <CardHeader>
                    <CardTitle>Revisão Final</CardTitle>
                    <CardDescription>Confira se está tudo certinho antes de solicitar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                      <div className="space-y-4">
                        <div>
                          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Imóvel e Limpeza</p>
                          <p className="font-bold text-lg">{details.propertyType} • {details.size}m²</p>
                          <p className="text-slate-600 font-medium">{details.rooms} Quartos, {details.bathrooms} Banheiros</p>
                          <p className="text-primary font-bold">Nível {details.cleaningLevel}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Agendamento e Local</p>
                          <p className="font-bold text-lg">{schedule.date} às {schedule.time}</p>
                          <p className="text-slate-600 font-medium">{address.street}, {address.number}</p>
                          <p className="text-slate-600 font-medium">{address.neighborhood}, {address.city}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={handleBack} className="h-14 px-10 rounded-full font-bold">Voltar</Button>
                  <Button onClick={handleSubmit} className="bg-primary hover:opacity-90 h-14 px-14 rounded-full text-xl font-bold shadow-2xl shadow-primary/30">
                    Confirmar e Chamar a Jaque!
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary Column (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="shadow-2xl border-none overflow-hidden">
              <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="text-lg">Resumo do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex justify-between items-center text-slate-600">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-medium text-lg text-slate-900">Duração estimada:</span>
                  </div>
                  <span className="font-bold text-2xl text-slate-900">{estimate.duration}h</span>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex flex-col">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Valor Sugerido</span>
                    <span className="text-5xl font-bold text-primary tracking-tighter">R$ {estimate.value}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic leading-relaxed">
                    *Este valor é uma estimativa justa baseada em mercado e esforço. O acerto é feito diretamente com a profissional.
                  </p>
                </div>

                <div className="space-y-5 pt-6 border-t border-slate-100">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Incluso:</span> Limpeza de superfícies, pisos, banheiros e cozinha básica.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Não Incluso:</span> Cuidados com pets, crianças ou lavagem pesada sem adicional.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 flex gap-4">
              <Sparkles className="w-6 h-6 text-primary shrink-0" />
              <p className="text-xs text-primary font-medium leading-relaxed">
                Nossas profissionais são selecionadas criteriosamente para garantir que seu lar receba o melhor cuidado e respeito.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
