-- LIMPEZA E CORREÇÃO DE TAREFAS
-- Use este script para garantir que o calendário funcione 100%

-- 1. Forçar coluna DATE ser tipo 'date' (remove horas/minutos se existirem)
ALTER TABLE tasks ALTER COLUMN date TYPE date USING date::date;

-- 2. Limpar tarefas antigas ou bugadas (Opcional, mas recomendado para começar limpo)
-- Descomente a linha abaixo se quiser zerar as tarefas para testar
-- TRUNCATE TABLE tasks;

-- 3. Remover qualquer tarefa que esteja com Data nula
DELETE FROM tasks WHERE date IS NULL;

-- 4. Garantir índices para performance do calendário
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
