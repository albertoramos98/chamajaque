-- TRUST & SAFETY UPDATE (LGPD + VERIFICAÇÃO + LINKS EXPIRÁVEIS)

-- 1. Campos de Segurança e Perfil na tabela Profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS intro_letter TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS document_status TEXT DEFAULT 'PENDING' CHECK (document_status IN ('PENDING', 'VERIFIED', 'REJECTED'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lgpd_consent BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS document_url TEXT; -- URL para o documento (RG/CPF)

-- 2. Tabela de Links Temporários (Expira em 5 minutos)
CREATE TABLE IF NOT EXISTS temporary_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS para Links Temporários
ALTER TABLE temporary_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura de links por token" ON temporary_links FOR SELECT USING (now() < expires_at);
CREATE POLICY "Admins gerenciam links" ON temporary_links FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
);
