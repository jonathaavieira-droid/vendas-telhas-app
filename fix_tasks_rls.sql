-- FIX TAREFAS PESSOAIS

-- 1. Garante que a coluna user_id existe e tem valor padrão auth.uid()
-- Isso é vital: se o frontend não mandar o ID, o banco preenche sozinho com o ID do usuário logado.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'user_id') THEN
        ALTER TABLE tasks ADD COLUMN user_id uuid REFERENCES auth.users(id);
    END IF;
END $$;

ALTER TABLE tasks ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 2. Reforçar RLS (Segurança)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tasks Own Data" ON tasks;
DROP POLICY IF EXISTS "Users can see own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Política Única e Simples:
-- Você só vê, cria, edita e deleta se o user_id for SEU.
CREATE POLICY "Tasks Privacy" ON tasks
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. Limpeza de tarefas "órfãs" (opcional - remove tarefas sem dono para não poluir, ou atribui ao admin)
-- DELETE FROM tasks WHERE user_id IS NULL; -- Perigoso, melhor deixar.
