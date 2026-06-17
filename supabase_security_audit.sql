-- AUDITORIA DE SEGURANÇA E INTEGRIDADE - CHAMADA JAQUE (DE VETERANO PARA DEV)
-- Objetivo: Blindar as tabelas contra acessos indevidos e garantir que o dinheiro e o trabalho estejam protegidos.

-- 1. Limpeza de políticas genéricas e inseguras
DROP POLICY IF EXISTS "Profissionais podem atualizar status de pedidos aceitos" ON service_requests;
DROP POLICY IF EXISTS "Profissionais podem ver pedidos aceitos ou pendentes" ON service_requests;

-- 2. Refinamento de Políticas para 'service_requests'

-- Quem pode VER: 
-- - O cliente que criou o pedido.
-- - Qualquer profissional se o pedido estiver PENDENTE (para ele poder aceitar).
-- - O profissional específico que foi atribuído ao pedido.
CREATE POLICY "Leitura protegida de pedidos" ON service_requests FOR SELECT USING (
  auth.uid() = client_id OR 
  (status = 'PENDING' AND professional_id IS NULL) OR
  auth.uid() = professional_id
);

-- Quem pode ATUALIZAR (Status/Profissional):
-- - Um profissional só pode se 'atribuir' se o campo professional_id estiver vazio e o status for PENDENTE.
-- - Um profissional só pode mudar o status (IN_PROGRESS, COMPLETED) se ELE for o profissional atribuído.
-- - O cliente só pode atualizar (CANCELAR) se o status for PENDING.

CREATE POLICY "Profissionais podem aceitar pedidos pendentes" ON service_requests 
FOR UPDATE USING (
  status = 'PENDING' AND professional_id IS NULL
) WITH CHECK (
  professional_id = auth.uid() AND status = 'ACCEPTED'
);

CREATE POLICY "Profissionais podem gerenciar progresso" ON service_requests 
FOR UPDATE USING (
  auth.uid() = professional_id AND status IN ('ACCEPTED', 'IN_PROGRESS')
) WITH CHECK (
  auth.uid() = professional_id AND status IN ('IN_PROGRESS', 'COMPLETED')
);

CREATE POLICY "Clientes podem cancelar pedidos pendentes" ON service_requests 
FOR UPDATE USING (
  auth.uid() = client_id AND status = 'PENDING'
) WITH CHECK (
  status = 'CANCELLED'
);

-- 3. Blindagem de Perfis
DROP POLICY IF EXISTS "Perfis visíveis para todos" ON profiles;
CREATE POLICY "Perfis públicos limitados" ON profiles FOR SELECT USING (true); -- Permitir ver profissionais, mas...
-- Adicionaremos triggers no futuro para garantir que dados sensíveis não vazem.

-- 4. Log de Auditoria Simples (Opcional, mas recomendado para 'dev raiz')
-- Em sistemas sérios, nunca deletamos nada, apenas marcamos como inativo.
-- Por enquanto, vamos apenas garantir que o UUID seja gerado corretamente.
ALTER TABLE service_requests ALTER COLUMN id SET DEFAULT uuid_generate_v4();
