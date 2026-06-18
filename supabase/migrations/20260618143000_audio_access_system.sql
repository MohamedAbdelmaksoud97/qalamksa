create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  gmail_message_id text unique,
  email_subject text,
  from_email text,
  is_active boolean not null default true,
  used_count integer not null default 0,
  last_accessed_at timestamptz,
  created_at timestamptz not null default now(),
  processed_at timestamptz not null default now()
);

create table if not exists public.audio_files (
  id uuid primary key default gen_random_uuid(),
  product_key text not null default 'product1',
  title text not null,
  storage_path text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint audio_files_product_key_check check (product_key in ('product1', 'product2'))
);

alter table public.audio_files
  add column if not exists product_key text not null default 'product1';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'audio_files_product_key_check'
  ) then
    alter table public.audio_files
      add constraint audio_files_product_key_check
      check (product_key in ('product1', 'product2'));
  end if;

end $$;

create table if not exists public.order_access_logs (
  id uuid primary key default gen_random_uuid(),
  order_id text,
  success boolean not null,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists orders_active_order_id_idx
  on public.orders (order_id)
  where is_active = true;

create index if not exists audio_files_active_product_sort_idx
  on public.audio_files (product_key, sort_order, created_at)
  where is_active = true;

create index if not exists order_access_logs_order_id_created_at_idx
  on public.order_access_logs (order_id, created_at desc);

alter table public.orders enable row level security;
alter table public.audio_files enable row level security;
alter table public.order_access_logs enable row level security;

create or replace function public.increment_order_used_count(input_order_id text)
returns void
language sql
security invoker
set search_path = public
as $$
  update public.orders
  set used_count = used_count + 1
  where order_id = input_order_id
    and is_active = true;
$$;

insert into storage.buckets (id, name, public)
values ('qalamksa', 'qalamksa', false)
on conflict (id) do update
set public = false;
