"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';
import Logo from '@/components/ui/Logo';

import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Logo size={34} />
          </Link>
          <div className="w-20 h-8 bg-slate-100 animate-pulse rounded-full"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Logo size={34} />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/#como-funciona" className="hover:text-primary transition-colors">Como funciona</Link>
          <Link href="/request" className="hover:text-primary transition-colors">Solicitar Faxina</Link>
          {user?.role === 'PROFESSIONAL' && (
             <Link href="/dashboard/professional" className="hover:text-primary transition-colors">Painel Profissional</Link>
          )}
          {user?.role === 'CLIENT' && (
             <Link href="/dashboard/client" className="hover:text-primary transition-colors">Minhas Faxinas</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end text-right leading-tight">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} title="Sair">
                <LogOut className="w-5 h-5 text-slate-500" />
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 text-xs sm:text-sm px-2.5 sm:px-4">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:opacity-90 text-white rounded-full text-xs sm:text-sm px-3 sm:px-6 transition-opacity">
                  Começar
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
