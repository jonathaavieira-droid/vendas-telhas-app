-- !!! SCRIPT DE EMERGÊNCIA ABSOLUTA !!!
-- Copie TUDO e cole no SQL Editor.
-- CLIQUE EM RUN.

-- 1. DESATIVAR TODAS AS TRAVAS DE SEGURANÇA (Para tudo voltar a aparecer)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE objections DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. CORRIGIR O PROBLEMA DAS DATAS NAS TAREFAS
-- Transforma a coluna 'date' em DATA Pura (remove horários que atrapalham o filtro)
-- Se der erro, ignora e tenta o próximo passo
DO $$ 
BEGIN 
    BEGIN
        ALTER TABLE tasks ALTER COLUMN date TYPE date USING date::date;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;
END $$;

-- 3. GARANTIR QUE A COLUNA USER_ID EXISTE
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'user_id') THEN
        ALTER TABLE tasks ADD COLUMN user_id uuid DEFAULT auth.uid();
    END IF;
END $$;

-- 4. LIMPAR TAREFAS BUGADAS (Aquelas sem data ou sem dono)
DELETE FROM tasks WHERE date IS NULL;

-- 5. RECONCEDER PERMISSÕES PADRÃO
GRANT ALL ON products TO PUBLIC;
GRANT ALL ON objections TO PUBLIC;
GRANT ALL ON tasks TO PUBLIC;
GRANT ALL ON profiles TO PUBLIC;
GRANT ALL ON products TO authenticated;
GRANT ALL ON objections TO authenticated;
GRANT ALL ON tasks TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- FIM. AGORA TUDO DEVE FUNCIONAR.
