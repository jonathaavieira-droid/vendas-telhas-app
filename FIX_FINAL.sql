-- ====================================
-- SCRIPT FINAL DE CORREÇÃO
-- Cole TUDO no SQL Editor do Supabase
-- ====================================

-- 1. PROFILES: Permitir que usuários leiam seu próprio perfil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can update any profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can read all profiles" ON profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can update any profile" ON profiles
    FOR UPDATE TO authenticated
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- 2. PRODUCTS: Todos autenticados leem, só admin edita
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access Products" ON products;
DROP POLICY IF EXISTS "Public View Products" ON products;
DROP POLICY IF EXISTS "Admin Edit Products" ON products;
DROP POLICY IF EXISTS "Authenticated View Products" ON products;

CREATE POLICY "Authenticated View Products" ON products
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin Edit Products" ON products
    FOR ALL TO authenticated
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- 3. OBJECTIONS: Todos autenticados leem, só admin edita
ALTER TABLE objections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access Objections" ON objections;
DROP POLICY IF EXISTS "Public View Objections" ON objections;
DROP POLICY IF EXISTS "Admin Edit Objections" ON objections;
DROP POLICY IF EXISTS "Authenticated View Objections" ON objections;

CREATE POLICY "Authenticated View Objections" ON objections
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin Edit Objections" ON objections
    FOR ALL TO authenticated
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- 4. TASKS: Cada usuário só vê as suas
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access Tasks" ON tasks;
DROP POLICY IF EXISTS "Tasks Privacy" ON tasks;
DROP POLICY IF EXISTS "Tasks Own Data" ON tasks;

CREATE POLICY "Tasks Privacy" ON tasks
    FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Garantir coluna user_id com default
DO $$
BEGIN
    BEGIN
        ALTER TABLE tasks ALTER COLUMN user_id SET DEFAULT auth.uid();
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
END $$;
