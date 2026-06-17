-- Habilita a extensão de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Perfis (Sincronizada com Auth.Users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('CLIENT', 'PROFESSIONAL')) NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_services INTEGER DEFAULT 0,
  bio TEXT,
  location TEXT,
  base_price_per_hour DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Serviços (Substitui o ServiceStore persistido)
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id) NOT NULL,
  professional_id UUID REFERENCES profiles(id),
  
  -- Detalhes do Imóvel
  property_type TEXT NOT NULL,
  size DECIMAL NOT NULL,
  rooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  cleaning_level TEXT NOT NULL,
  has_pets BOOLEAN DEFAULT FALSE,
  has_outdoor_area BOOLEAN DEFAULT FALSE,
  additional_services TEXT[] DEFAULT '{}',
  observations TEXT,
  
  -- Endereço
  address_street TEXT NOT NULL,
  address_number TEXT NOT NULL,
  address_complement TEXT,
  address_neighborhood TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_zip_code TEXT NOT NULL,
  
  -- Agendamento
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  estimated_duration DECIMAL NOT NULL,
  estimated_value DECIMAL NOT NULL,
  
  -- Status e Metadados
  status TEXT CHECK (status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
  checklist JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS (Row Level Security) - Segurança básica
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para perfis
CREATE POLICY "Perfis visíveis para todos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem editar próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas de acesso para serviços
CREATE POLICY "Clientes podem ver seus próprios pedidos" ON service_requests FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Profissionais podem ver pedidos aceitos ou pendentes" ON service_requests FOR SELECT USING (true);
CREATE POLICY "Clientes podem criar pedidos" ON service_requests FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Profissionais podem atualizar status de pedidos aceitos" ON service_requests FOR UPDATE USING (true);
