-- 1. Get the User ID from auth.users (Using email)
DO $$
DECLARE
  target_user_id uuid;
  user_email text := 'jonatha.vieira@exemplo.com'; -- SUBSTITUA PELO SEU EMAIL SE FOR DIFERENTE
BEGIN
  -- Find the user
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;

  IF target_user_id IS NOT NULL THEN
    -- 2. Insert or Update Profile
    INSERT INTO public.profiles (id, email, role)
    VALUES (target_user_id, user_email, 'admin')
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin';
    
    RAISE NOTICE 'Usuário % transformado em Admin com sucesso!', user_email;
  ELSE
    RAISE NOTICE 'Usuário não encontrado! Verifique se o email está correto.';
  END IF;
END $$;
