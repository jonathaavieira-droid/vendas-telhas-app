-- ==========================================
-- SCRIPT DE CORREÇÃO GERAL (V3)
-- ==========================================

-- 1. Garantir que Tabelas existam e RLS esteja ativo
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE objections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Limpar Politicas Antigas (para evitar conflitos)
DROP POLICY IF EXISTS "Public Access Products" ON products;
DROP POLICY IF EXISTS "Public Access Objections" ON objections;
DROP POLICY IF EXISTS "Public Access Tasks" ON tasks;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Everyone can view products" ON products;
DROP POLICY IF EXISTS "Everyone can view objections" ON objections;

-- 3. CRIAR POLÍTICAS PERMISSIVAS (Corrige o "sumiço" dos dados)

-- Produtos e Objeções: TODOS podem VER (select)
CREATE POLICY "Enable Read Access for All" ON products FOR SELECT USING (true);
CREATE POLICY "Enable Read Access for All Obj" ON objections FOR SELECT USING (true);

-- Produtos e Objeções: Apenas Autenticados podem CRIAR/EDITAR (insert/update/delete)
CREATE POLICY "Enable Insert for Authenticated" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable Update for Authenticated" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable Delete for Authenticated" ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable Insert for Authenticated Obj" ON objections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable Update for Authenticated Obj" ON objections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable Delete for Authenticated Obj" ON objections FOR DELETE USING (auth.role() = 'authenticated');

-- Profiles: TODOS podem VER (necessário para o sistema checar quem é admin)
CREATE POLICY "Enable Read Access for Profiles" ON profiles FOR SELECT USING (true);
-- Cada um edita o seu
CREATE POLICY "Enable Update for Own Profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable Insert for Own Profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tasks: Cada um vê a sua (RLS real)
DROP POLICY IF EXISTS "Users can see own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

CREATE POLICY "Users can see own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL); 
-- (OBS: user_id IS NULL permite ver tarefas antigas sem dono, útil para migração)

CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);


-- 4. FORÇAR CRIAÇÃO DO SEU USUÁRIO ADMIN (Novamente)
DO $$
DECLARE
  target_user_id uuid;
  -- INSIRA SEU EMAIL ABAIXO SE AINDA NÃO COLOCOU
  user_email text := 'jonatha.vieira@telhaco.com.br'; 
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;

  IF target_user_id IS NOT NULL THEN
    -- Tenta inserir, se já existe, atualiza para Admin
    INSERT INTO public.profiles (id, email, role)
    VALUES (target_user_id, user_email, 'admin')
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin';
  END IF;
END $$;
