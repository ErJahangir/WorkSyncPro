-- Create a table to store FCM tokens for push notifications
create table if not exists public.fcm_tokens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  token text not null,
  platform text check (platform in ('android', 'ios')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure a user doesn't have duplicate entries for the same token
  unique(user_id, token)
);

-- Add reminder columns if they don't exist
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name='fcm_tokens' and column_name='reminder_enabled') then
    alter table public.fcm_tokens add column reminder_enabled boolean default false;
  end if;

  if not exists (select 1 from information_schema.columns where table_name='fcm_tokens' and column_name='reminder_time') then
    alter table public.fcm_tokens add column reminder_time time;
  end if;
end $$;

-- Enable Row Level Security
alter table public.fcm_tokens enable row level security;

-- Drop existing policies to avoid errors on rerun
drop policy if exists "Users can insert their own tokens" on public.fcm_tokens;
drop policy if exists "Users can view their own tokens" on public.fcm_tokens;
drop policy if exists "Users can delete their own tokens" on public.fcm_tokens;
drop policy if exists "Users can update their own tokens" on public.fcm_tokens;

-- Create Policies
create policy "Users can insert their own tokens" 
  on public.fcm_tokens for insert 
  with check (auth.uid() = user_id);

create policy "Users can view their own tokens" 
  on public.fcm_tokens for select 
  using (auth.uid() = user_id);

create policy "Users can update their own tokens" 
  on public.fcm_tokens for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tokens" 
  on public.fcm_tokens for delete 
  using (auth.uid() = user_id);

-- Updated at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.fcm_tokens;

create trigger set_updated_at
  before update on public.fcm_tokens
  for each row
  execute function public.handle_updated_at();
