"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Star,
  Activity,
  Layers,
  LayoutDashboard
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";

// Dados fictícios de crescimento para o investidor ver
const growthData = [
  { name: 'Jan', revenue: 4000, users: 240 },
  { name: 'Fev', revenue: 3000, users: 198 },
  { name: 'Mar', revenue: 2000, users: 980 },
  { name: 'Abr', revenue: 2780, users: 3908 },
  { name: 'Mai', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
];

const categoryData = [
  { name: 'Limpeza Leve', value: 400 },
  { name: 'Limpeza Pesada', value: 300 },
  { name: 'Escritórios', value: 200 },
  { name: 'Pós-Obra', value: 278 },
];

const COLORS = ['#FF5A5F', '#008489', '#484848', '#767676'];

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalRevenue: 0,
    activeProfessionals: 0,
    averageTicket: 0,
    conversionRate: '8.4%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminStats() {
      const supabase = createClient();
      
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: servicesCount } = await supabase.from('service_requests').select('*', { count: 'exact', head: true });
      const { data: revenueData } = await supabase.from('service_requests').select('estimated_value').eq('status', 'COMPLETED');
      
      const revenue = revenueData?.reduce((acc, curr) => acc + Number(curr.estimated_value), 0) || 0;
      
      setStats({
        totalUsers: usersCount || 0,
        totalServices: servicesCount || 0,
        totalRevenue: revenue,
        activeProfessionals: Math.round((usersCount || 0) * 0.4), // Estimativa para o dashboard
        averageTicket: servicesCount ? Math.round(revenue / servicesCount) : 0,
        conversionRate: '12.2%'
      });
      setLoading(false);
    }

    if (user?.email === "albertinhorss@gmail.com" || user?.role === 'ADMIN') {
      fetchAdminStats();
    } else if (user) {
      redirect("/dashboard/client");
    }
  }, [user]);

  if (loading) return <div className="p-20 text-center">Iniciando Centro de Comando...</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Top Bar - Admin Specific */}
      <div className="bg-slate-900 text-white py-4 mb-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary w-5 h-5" />
            <span className="font-bold tracking-tight">MODO ADMINISTRADOR</span>
          </div>
          <div className="text-xs text-slate-400">
            Sessão iniciada como: <span className="text-white font-mono">{user?.email}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Visão Geral do Negócio</h1>
            <p className="text-slate-500">Métricas de performance em tempo real do ChamaJaque.</p>
          </div>
          <div className="flex gap-3">
             <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1">
                Servidores OK
             </Badge>
             <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1">
                v1.2.0-stable
             </Badge>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Receita Total" 
            value={`R$ ${stats.totalRevenue.toLocaleString()}`} 
            trend="+12.5%" 
            icon={<DollarSign className="w-6 h-6" />}
            isPositive={true}
          />
          <KPICard 
            title="Usuários Ativos" 
            value={stats.totalUsers.toString()} 
            trend="+8.2%" 
            icon={<Users className="w-6 h-6" />}
            isPositive={true}
          />
          <KPICard 
            title="Serviços Realizados" 
            value={stats.totalServices.toString()} 
            trend="+24.1%" 
            icon={<Calendar className="w-6 h-6" />}
            isPositive={true}
          />
          <KPICard 
            title="Taxa de Conversão" 
            value={stats.conversionRate} 
            trend="-0.4%" 
            icon={<TrendingUp className="w-6 h-6" />}
            isPositive={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 shadow-sm border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Crescimento Mensal (GMV)
              </CardTitle>
              <CardDescription>Volume de transações e novos usuários nos últimos 7 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5A5F" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#FF5A5F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#FF5A5F" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Side Chart: Categories */}
          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Mix de Serviços
              </CardTitle>
              <CardDescription>Distribuição por categoria</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                    {c.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lower Section: Recent Users & Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Card className="shadow-sm border-none">
              <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle>Novos Profissionais</CardTitle>
                    <CardDescription>Aguardando validação de documentos</CardDescription>
                 </div>
                 <Button variant="ghost" size="sm" className="text-primary font-bold">Ver todos</Button>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {[
                      { name: 'Jaqueline S.', date: 'Há 2h', status: 'PENDING' },
                      { name: 'Maria Oliveira', date: 'Há 5h', status: 'VERIFIED' },
                      { name: 'Luciana Costa', date: 'Ontem', status: 'PENDING' },
                    ].map((user, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                              {user.name[0]}
                           </div>
                           <div>
                              <p className="text-sm font-bold">{user.name}</p>
                              <p className="text-[10px] text-slate-400">{user.date}</p>
                           </div>
                        </div>
                        <Badge className={user.status === 'VERIFIED' ? 'bg-green-100 text-green-700 border-none' : 'bg-amber-100 text-amber-700 border-none'}>
                           {user.status === 'VERIFIED' ? 'Verificado' : 'Em análise'}
                        </Badge>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-none bg-primary text-white">
              <CardHeader>
                 <CardTitle className="text-white">Pitch de Investimento</CardTitle>
                 <CardDescription className="text-primary-foreground/80">Highlights para o próximo Q4</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="bg-white/10 p-4 rounded-2xl">
                    <p className="text-sm font-bold mb-1">Crescimento de Retenção</p>
                    <p className="text-xs text-primary-foreground/80">Implementação do algoritmo de fidelidade aumentou o LTV em 15%.</p>
                 </div>
                 <div className="bg-white/10 p-4 rounded-2xl">
                    <p className="text-sm font-bold mb-1">Eficiência Operacional</p>
                    <p className="text-xs text-primary-foreground/80">O tempo médio de aceitação de serviços caiu para 14 minutos.</p>
                 </div>
                 <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-full">Gerar Relatório Completo</Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon, isPositive }: { title: string, value: string, trend: string, icon: any, isPositive: boolean }) {
  return (
    <Card className="border-none shadow-sm overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-900 group-hover:bg-primary group-hover:text-white transition-colors">
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
