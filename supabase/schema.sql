-- Impact Création — schéma Supabase
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Sans titre',
  category text not null default 'Design',
  image_url text not null,
  image_path text,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  whatsapp text default '',
  phone text default '',
  email text default '',
  location text default '',
  password_hash text default ''
);
