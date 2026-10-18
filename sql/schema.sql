-- Applied automatically on the first API call. This file is the same schema for the Supabase SQL editor.
create table if not exists qa_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);
create table if not exists qa_otp (
  email text primary key,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  sent_at timestamptz not null default now()
);
create table if not exists qa_sessions (
  token_hash text primary key,
  user_id uuid not null references qa_users(id) on delete cascade,
  expires_at timestamptz not null
);
create table if not exists qa_progress (
  user_id uuid primary key references qa_users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
