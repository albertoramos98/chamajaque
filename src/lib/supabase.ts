import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Um dev sênior sabe que o build worker da Vercel pode não ter as envs
  // e não queremos que o build quebre por causa de uma página estática (como 404)
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[SUPABASE_WARN]: Variáveis de ambiente faltando no build!');
    }
    // Retornamos um cliente com placeholders para não quebrar o build
    return createBrowserClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
