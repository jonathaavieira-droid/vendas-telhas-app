-- LIBERAR LEITURA DE PRODUTOS E OBJEÇÕES PARA TODOS
-- Cole isso no SQL Editor do Supabase e clique RUN

-- PRODUTOS: limpar policies antigas e criar nova
DROP POLICY IF EXISTS "Public Access Products" ON products;
DROP POLICY IF EXISTS "Public View Products" ON products;
DROP POLICY IF EXISTS "Authenticated View Products" ON products;
DROP POLICY IF EXISTS "Admin Edit Products" ON products;
DROP POLICY IF EXISTS "products_select" ON products;
DROP POLICY IF EXISTS "products_all" ON products;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "todos_leem_produtos" ON products
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_edita_produtos" ON products
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "admin_update_produtos" ON products
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "admin_delete_produtos" ON products
    FOR DELETE TO authenticated USING (true);

-- OBJEÇÕES: limpar policies antigas e criar nova
DROP POLICY IF EXISTS "Public Access Objections" ON objections;
DROP POLICY IF EXISTS "Public View Objections" ON objections;
DROP POLICY IF EXISTS "Authenticated View Objections" ON objections;
DROP POLICY IF EXISTS "Admin Edit Objections" ON objections;
DROP POLICY IF EXISTS "objections_select" ON objections;
DROP POLICY IF EXISTS "objections_all" ON objections;

ALTER TABLE objections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "todos_leem_objecoes" ON objections
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_edita_objecoes" ON objections
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "admin_update_objecoes" ON objections
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "admin_delete_objecoes" ON objections
    FOR DELETE TO authenticated USING (true);

-- PROFILES: garantir leitura
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_select" ON profiles;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "todos_leem_perfis" ON profiles
    FOR SELECT TO authenticated USING (true);
