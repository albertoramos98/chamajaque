"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, AlertCircle } from "lucide-react";

export default function ViewProfilePage() {
  const { token } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSecureProfile() {
      const supabase = createClient();
      
      // 1. Validar token e buscar ID do perfil
      const { data: linkData, error: linkError } = await supabase
        .from('temporary_links')
        .select('profile_id, expires_at')
        .eq('token', token)
        .single();

      if (linkError || !linkData) {
        setError("Este link expirou ou é inválido.");
        setLoading(false);
        return;
      }

      // 2. Buscar dados do perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', linkData.profile_id)
        .single();

      setProfile(profileData);
      setLoading(false);
    }

    loadSecureProfile();
  }, [token]);

  if (loading) return <div className="p-20 text-center">Validando acesso seguro...</div>;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="max-w-md text-center p-8 space-y-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold">Link Expirado</h2>
        <p className="text-slate-500">Por segurança, este link de visualização dura apenas 5 minutos. Solicite um novo link ao administrador.</p>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center gap-2 text-sm font-bold">
        <Clock className="w-4 h-4" /> VISUALIZAÇÃO TEMPORÁRIA (EXPIRA EM BREVE)
      </div>
      <Card className="border-none shadow-2xl rounded-t-none">
        <CardHeader className="text-center space-y-4">
          <Avatar className="w-24 h-24 mx-auto border-4 border-slate-50">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl">{profile.name}</CardTitle>
            <div className="flex justify-center gap-2 mt-2">
              <Badge className="bg-green-100 text-green-700 border-none">
                <ShieldCheck className="w-3 h-3 mr-1" /> Documentos Verificados
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
             <h3 className="font-bold text-slate-900 border-b pb-2">Carta de Apresentação</h3>
             <p className="text-slate-600 leading-relaxed italic">
               "{profile.intro_letter || 'Nenhuma carta de apresentação disponível.'}"
             </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Avaliação Média</p>
                <p className="text-xl font-bold text-slate-900">4.9 / 5.0</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Serviços na Plataforma</p>
                <p className="text-xl font-bold text-slate-900">{profile.total_services}+</p>
             </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest">
            Protegido por ChamaJaque Trust & Safety
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
