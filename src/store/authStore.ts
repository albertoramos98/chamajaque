import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, role) => {
        // Simulação de login
        const mockUser: User = {
          id: role === 'CLIENT' ? 'client-1' : 'prof-1',
          name: role === 'CLIENT' ? 'Cliente Exemplo' : 'Jaqueline Silva',
          email: email,
          role: role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };
        set({ user: mockUser });
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'chama-jaque-auth',
    }
  )
);
