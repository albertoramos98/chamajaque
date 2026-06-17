-- ATUALIZAÇÃO PARA SUPORTE AO PERFIL DE ADMIN
-- Rode isso no seu SQL Editor do Supabase

-- 1. Atualizar a constraint de role para aceitar 'ADMIN'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('CLIENT', 'PROFESSIONAL', 'ADMIN'));

-- 2. Garantir que o admin tenha acesso total (bypass de segurança para o dashboard)
CREATE POLICY "Admins podem ver tudo" ON service_requests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
  )
);

CREATE POLICY "Admins podem gerenciar todos os perfis" ON profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
  )
);
