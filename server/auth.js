const crypto = require('crypto');
const { query, fail } = require('./db');
const { sendCode } = require('./mail');

const ALLOW = new Set(['qa-read', 'qa-quiz', 'qa-tasks', 'qa-road', 'qa5-path', 'qa5-game', 'qa10-sim-saved', 'qa5-settings']);

function hash(value) {
  return crypto.createHash('sha256').update(String(value) + ':' + process.env.SESSION_SECRET).digest('hex');
}
function emailOf(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) throw fail(400, 'Enter a valid email address.');
  return email;
}
function cookieHeader(token, maxAge) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return `qa_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
function tokenFrom(req) {
  const raw = req.headers.cookie || '';
  const match = raw.match(/(?:^|; )qa_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}
function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string' && req.body) {
    try { return Promise.resolve(JSON.parse(req.body)); }
    catch { return Promise.reject(fail(400, 'Expected JSON.')); }
  }
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) reject(fail(413, 'Request is too large.'));
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); }
      catch { reject(fail(400, 'Expected JSON.')); }
    });
    req.on('error', reject);
  });
}
function sendJson(res, status, body, extra) {
  const headers = Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, extra || {});
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

async function requestOtp(rawEmail) {
  const email = emailOf(rawEmail);
  const existing = await query('select sent_at from qa_otp where email=$1', [email]);
  if (existing.rows[0]) {
    const age = Date.now() - new Date(existing.rows[0].sent_at).getTime();
    if (age < 60000) throw fail(429, 'Wait a minute before asking for another code.');
  }
  const code = String(crypto.randomInt(100000, 1000000));
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  await query(
    `insert into qa_otp (email, code_hash, expires_at, attempts, sent_at)
     values ($1,$2,$3,0,now())
     on conflict (email) do update set code_hash=$2, expires_at=$3, attempts=0, sent_at=now()`,
    [email, hash(email + ':' + code), expires]
  );
  const sent = await sendCode(email, code);
  return sent.devCode ? { ok: true, devCode: sent.devCode } : { ok: true };
}

async function verifyOtp(rawEmail, rawCode) {
  const email = emailOf(rawEmail);
  const code = String(rawCode || '').trim();
  if (!/^\d{6}$/.test(code)) throw fail(400, 'Enter the 6-digit code.');
  const found = await query('select code_hash, expires_at, attempts from qa_otp where email=$1', [email]);
  const row = found.rows[0];
  if (!row || new Date(row.expires_at).getTime() < Date.now()) throw fail(400, 'That code has expired. Ask for a new one.');
  if (row.attempts >= 5) throw fail(400, 'Too many tries. Ask for a new code.');
  if (row.code_hash !== hash(email + ':' + code)) {
    await query('update qa_otp set attempts=attempts+1 where email=$1', [email]);
    throw fail(400, 'That code is not right.');
  }
  await query('delete from qa_otp where email=$1', [email]);
  const user = await query(
    `insert into qa_users (email) values ($1)
     on conflict (email) do update set email=excluded.email
     returning id, email`,
    [email]
  );
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await query('insert into qa_sessions (token_hash, user_id, expires_at) values ($1,$2,$3)', [hash(token), user.rows[0].id, expires]);
  return { email: user.rows[0].email, cookie: cookieHeader(token, 30 * 24 * 60 * 60) };
}

async function userFrom(req) {
  const token = tokenFrom(req);
  if (!token) return null;
  const found = await query(
    `select u.id, u.email from qa_sessions s
     join qa_users u on u.id=s.user_id
     where s.token_hash=$1 and s.expires_at>now()`,
    [hash(token)]
  );
  return found.rows[0] || null;
}

async function logout(req) {
  const token = tokenFrom(req);
  if (token) await query('delete from qa_sessions where token_hash=$1', [hash(token)]);
  return cookieHeader('', 0);
}

async function getProgress(userId) {
  const found = await query('select data, updated_at from qa_progress where user_id=$1', [userId]);
  if (!found.rows[0]) return { data: {}, updated_at: null };
  return { data: found.rows[0].data || {}, updated_at: new Date(found.rows[0].updated_at).toISOString() };
}

async function putProgress(userId, raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw fail(400, 'Expected a progress object.');
  const data = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!ALLOW.has(key)) continue;
    if (typeof value !== 'string' || value.length > 100000) throw fail(400, 'A progress value is not valid.');
    data[key] = value;
  }
  const saved = await query(
    `insert into qa_progress (user_id, data, updated_at) values ($1,$2::jsonb,now())
     on conflict (user_id) do update set data=excluded.data, updated_at=now()
     returning updated_at`,
    [userId, JSON.stringify(data)]
  );
  return { ok: true, updated_at: new Date(saved.rows[0].updated_at).toISOString() };
}

module.exports = { requestOtp, verifyOtp, userFrom, logout, getProgress, putProgress, readBody, sendJson, fail };
