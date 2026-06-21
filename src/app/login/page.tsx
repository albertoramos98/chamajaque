"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRight, User as UserIcon, Briefcase, Loader2 } from "lucide-react";
import { LogoIcon } from "@/components/ui/Logo";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CLIENT");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Buscar o perfil para confirmar o role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      toast.success(`Bem-vindo de volta!`);
      const userRole = profile?.role || role;
      
      // Lógica de redirecionamento especial para o Admin Principal
      if (email === "albertinhorss@gmail.com") {
        router.push("/dashboard/admin");
        return;
      }

      router.push(userRole === "CLIENT" ? "/dashboard/client" : "/dashboard/professional");
    } catch (error: any) {
      toast.error(error.message || "Erro ao entrar. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-primary/5">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <LogoIcon size={48} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Acesse sua conta</CardTitle>
          <CardDescription>Bem-vindo ao Chama Jaque</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="CLIENT" onValueChange={(v) => setRole(v as UserRole)}>
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="CLIENT" className="gap-2">
                <UserIcon className="w-4 h-4" /> Cliente
              </TabsTrigger>
              <TabsTrigger value="PROFESSIONAL" className="gap-2">
                <Briefcase className="w-4 h-4" /> Profissional
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Seu melhor e-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="exemplo@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Sua senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 h-12 text-lg rounded-full font-bold text-white">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>Entrar <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
             <p className="text-sm text-slate-500">
               Ainda não tem conta?{" "}
               <Link href="/register" className="text-primary font-bold hover:underline">
                 Cadastre-se aqui
               </Link>
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
