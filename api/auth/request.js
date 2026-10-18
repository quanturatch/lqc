const { requestOtp, readBody, sendJson } = require('../../server/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Use POST.' });
  try {
    const body = await readBody(req);
    sendJson(res, 200, await requestOtp(body.email));
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message || 'Could not send the code.' });
  }
};
