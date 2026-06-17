import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { profileId } = await request.json();
    const supabase = createClient();

    // 1. Verificar se é admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminProfile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // 2. Gerar Token único
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutos

    // 3. Salvar no banco
    const { error } = await supabase
      .from('temporary_links')
      .insert([{ profile_id: profileId, token, expires_at: expiresAt }]);

    if (error) throw error;

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    return NextResponse.json({ link: `${baseUrl}/view-profile/${token}` });
  } catch (error) {
    console.error('Error generating link:', error);
    return NextResponse.json({ error: 'Falha ao gerar link' }, { status: 500 });
  }
}
