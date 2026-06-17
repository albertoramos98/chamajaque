"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, ArrowRight, User as UserIcon, Briefcase } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("CLIENT");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, insira seu e-mail.");
      return;
    }
    login(email, role);
    toast.success(`Bem-vindo de volta!`);
    router.push(role === "CLIENT" ? "/dashboard/client" : "/dashboard/professional");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-orange-50/30">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-orange-600 p-2 rounded-xl text-white">
              <Sparkles className="w-6 h-6" />
            </div>
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
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg rounded-full font-bold">
              Entrar <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="text-center space-y-2">
             <p className="text-sm text-slate-500">
               Ainda não tem conta?{" "}
               <Link href="/register" className="text-orange-600 font-bold hover:underline">
                 Cadastre-se aqui
               </Link>
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
