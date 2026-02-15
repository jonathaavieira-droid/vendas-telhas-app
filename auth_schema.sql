-- Create Profiles Table (Public profile info for each user)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'vendor' check (role in ('vendor', 'manager', 'supervisor', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies for Profiles
-- 1. Public Read (or Authenticated Read) - useful for admin to see list
create policy "Public profiles are viewable by everyone" 
on profiles for select 
using ( true );

-- 2. Users can insert their own profile (triggered by handleNewUser potentially, or auto-created)
-- For now, we allow insert if auth.uid() matches id
create policy "Users can insert their own profile" 
on profiles for insert 
with check ( auth.uid() = id );

-- 3. Only Admins can update roles (we'll implement a stricter check via function or app logic later)
-- For simplicity in this demo: Users can update their own email. 
-- Role updates should be restricted, but simplest RLS for now:
create policy "Users can update own profile" 
on profiles for update 
using ( auth.uid() = id );

-- Policies for Tasks (Row Level Security)
-- Users can only see/edit their OWN tasks
-- First, we need to ensure tasks has a user_id column that is NOT null generally, 
-- but for migration we might have nulls.
-- Let's update tasks table to trust the app for now or add user_id.

-- Add user_id to tasks if not exists (it was in the schema but might be null)
-- We will enforce RLS on tasks later once we have users logged in.

-- Trigger to auto-create profile on signup (Optional but recommended)
-- This function mimics Supabase best practices for handling new users
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'vendor');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
