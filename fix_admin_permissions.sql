-- PERMISSÕES DE ADMINISTRAÇÃO

-- 1. Permitir que ADMINS editem qualquer perfil (para mudar cargos)
CREATE POLICY "Admins can update any profile" 
ON profiles 
FOR UPDATE 
TO authenticated 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. Garantir leitura pública dos perfis (já deve estar feito, mas reforçando)
DROP POLICY IF EXISTS "Profiles View All" ON profiles;
CREATE POLICY "Profiles View All" ON profiles FOR SELECT TO authenticated USING (true);
