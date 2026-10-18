const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const file = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const i = trimmed.indexOf('=');
    if (i < 1) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (process.env[key] == null || process.env[key] === '') process.env[key] = value;
  }
}
loadEnv();

function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

let pool;
let ready;

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes('[YOUR-PASSWORD]')) {
    throw fail(500, 'Set DATABASE_URL in the environment. Replace [YOUR-PASSWORD] with the Supabase database password.');
  }
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 16) {
    throw fail(500, 'Set SESSION_SECRET in the environment to a long random string.');
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 1,
      idleTimeoutMillis: 10000,
      ssl: /supabase\.co/i.test(connectionString) ? { rejectUnauthorized: false } : undefined
    });
  }
  return pool;
}

async function query(text, params) {
  await ensureSchema();
  return getPool().query(text, params);
}

async function ensureSchema() {
  if (ready) return ready;
  ready = (async () => {
    const db = getPool();
    await db.query(`
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
    `);
  })().catch(error => { ready = null; throw error; });
  return ready;
}

module.exports = { query, fail, loadEnv };
