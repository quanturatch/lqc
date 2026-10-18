const { fail } = require('./db');

function env(name) {
  const value = process.env[name];
  return value && String(value).trim() ? String(value).trim() : '';
}
function plainAddress(value) {
  const match = String(value).match(/<([^>]+)>/);
  return (match ? match[1] : value).trim();
}
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function fromHeader(alias) {
  return alias.includes('<') ? alias : `Quantum Atlas <${alias}>`;
}

async function sendCode(email, code) {
  const subject = 'Your Quantum Atlas sign-in code';
  const text = `Your Quantum Atlas sign-in code is ${code}. It expires in 10 minutes. If you did not ask for it, you can ignore this email.`;
  const address = env('EMAIL_ADDRESS') || env('SMTP_USER');
  const alias = env('EMAIL_ALIAS') || env('EMAIL_FROM');
  const password = (env('EMAIL_APP_PASSWORD') || env('SMTP_PASS')).replace(/\s+/g, '');
  if (address || alias || password) {
    if (!isEmail(plainAddress(address)) || !isEmail(plainAddress(alias)) || !password) {
      throw fail(503, 'Set EMAIL_ADDRESS, EMAIL_ALIAS, and EMAIL_APP_PASSWORD. The alias is the sender learners see. The app password belongs to the real mailbox.');
    }
    const port = Number(env('SMTP_PORT') || 587);
    const nodemailer = require('nodemailer');
    const transport = nodemailer.createTransport({
      host: env('SMTP_HOST') || 'smtp.gmail.com',
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user: plainAddress(address), pass: password }
    });
    try {
      await transport.sendMail({ from: fromHeader(alias), to: email, subject, text });
    } catch (err) {
      const detail = String(err && err.message || '');
      const safe = /pass|secret|token|key/i.test(detail) ? '' : detail.slice(0, 180);
      throw fail(502, 'The mail server rejected the sign-in code.' + (safe ? ' ' + safe : ''));
    }
    return { sent: true };
  }
  if (env('RESEND_API_KEY') && alias) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + env('RESEND_API_KEY'), 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromHeader(alias), to: [email], subject, text })
    });
    if (!response.ok) throw fail(502, 'The email service rejected the code.');
    return { sent: true };
  }
  if (process.env.OTP_DEBUG === '1') return { sent: false, devCode: code };
  throw fail(503, 'Email is not configured. Set EMAIL_ADDRESS, EMAIL_ALIAS, and EMAIL_APP_PASSWORD.');
}

module.exports = { sendCode };
