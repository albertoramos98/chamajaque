"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowRight, User as UserIcon, Briefcase, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("CLIENT");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("Erro ao criar usuário.");

      // Criar o perfil na tabela 'profiles'
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            role: role,
          }
        ]);

      if (profileError) throw profileError;

      toast.success(`Conta criada com sucesso!`);
      router.push(role === "CLIENT" ? "/dashboard/client" : "/dashboard/professional");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] py-12 flex items-center justify-center p-4 bg-primary/5">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Junte-se à comunidade que valoriza o <span className="text-primary">cuidado</span>.
          </h1>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded-full text-green-600 mt-1">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-slate-600 text-sm">Segurança em primeiro lugar para todos.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded-full text-green-600 mt-1">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-slate-600 text-sm">Transparência total nos valores e serviços.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded-full text-green-600 mt-1">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-slate-600 text-sm">Dignidade e respeito à profissional doméstica.</p>
            </li>
          </ul>
        </div>

        <Card className="shadow-2xl border-none">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="bg-primary p-2 rounded-xl text-white">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Crie sua conta</CardTitle>
            <CardDescription>Escolha como deseja usar o Chama Jaque</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="CLIENT" onValueChange={(v) => setRole(v as UserRole)}>
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="CLIENT" className="gap-2">
                  <UserIcon className="w-4 h-4" /> Quero Contratar
                </TabsTrigger>
                <TabsTrigger value="PROFESSIONAL" className="gap-2">
                  <Briefcase className="w-4 h-4" /> Quero Trabalhar
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  placeholder="Seu nome" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="exemplo@email.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Mínimo 6 caracteres" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              
              <p className="text-[10px] text-slate-400 leading-tight">
                Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade, 
                e reconhece que a Chama Jaque é uma plataforma de intermediação baseada no respeito mútuo.
              </p>

              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 h-14 text-lg rounded-full font-bold text-white">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>Criar minha conta <ArrowRight className="ml-2 w-5 h-5" /></>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-slate-500">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
