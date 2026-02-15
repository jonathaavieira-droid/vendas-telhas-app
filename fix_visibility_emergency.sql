-- CORREÇÃO DE VISIBILIDADE (EMERGÊNCIA)
-- Este script libera a visualização de Produtos e Objeções para TODOS (mesmo se o login cair).
-- Mantém a segurança de escrita (só Admin edita).

-- 1. Produtos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated View Products" ON products;
DROP POLICY IF EXISTS "Public Access Products" ON products;
DROP POLICY IF EXISTS "Enable Read Access for All" ON products;

-- Criar política que permite QUALQUER UM ver (resolve o problema de sumir)
CREATE POLICY "Public View Products" ON products FOR SELECT USING (true);


-- 2. Objeções
ALTER TABLE objections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated View Objections" ON objections;
DROP POLICY IF EXISTS "Public Access Objections" ON objections;
DROP POLICY IF EXISTS "Enable Read Access for All Obj" ON objections;

CREATE POLICY "Public View Objections" ON objections FOR SELECT USING (true);


-- 3. Reforçar que Admin pode tudo (para garantir que você não perca acesso de edição)
-- Produtos
DROP POLICY IF EXISTS "Admin Edit Products" ON products;
CREATE POLICY "Admin Edit Products" ON products FOR ALL TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Objeções
DROP POLICY IF EXISTS "Admin Edit Objections" ON objections;
CREATE POLICY "Admin Edit Objections" ON objections FOR ALL TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
