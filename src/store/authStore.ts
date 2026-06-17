import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { createClient } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchProfile: (id: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  fetchProfile: async (id) => {
    const supabase = createClient();
    
    // 1. Tentar buscar o perfil
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      set({
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          avatar: data.avatar_url,
          phone: data.phone,
          rating: data.rating,
          totalServices: data.total_services,
        },
        isLoading: false,
      });
    } else {
      // 2. Fallback: Se o perfil não existir (ex: Admin criado manualmente no Supabase),
      // pegamos os dados direto do Auth para não travar o sistema.
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
         set({
           user: {
             id: authData.user.id,
             name: 'Administrador', // Fallback genérico
             email: authData.user.email || '',
             role: authData.user.email === 'albertinhorss@gmail.com' ? 'ADMIN' : 'CLIENT',
           },
           isLoading: false
         });
      } else {
         set({ isLoading: false });
      }
    }
  },
  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, isLoading: false });
  },
}));
