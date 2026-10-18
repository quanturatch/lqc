const { logout, readBody, sendJson } = require('../../server/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Use POST.' });
  try {
    await readBody(req);
    sendJson(res, 200, { ok: true }, { 'Set-Cookie': await logout(req) });
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message || 'Could not sign you out.' });
  }
};
