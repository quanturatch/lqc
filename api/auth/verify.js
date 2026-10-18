const { verifyOtp, readBody, sendJson } = require('../../server/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Use POST.' });
  try {
    const body = await readBody(req);
    const out = await verifyOtp(body.email, body.code);
    sendJson(res, 200, { ok: true, email: out.email }, { 'Set-Cookie': out.cookie });
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message || 'Could not sign you in.' });
  }
};
