"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, fetchProfile } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, fetchProfile, supabase]);

  return <>{children}</>;
}
