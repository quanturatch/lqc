const { userFrom, sendJson } = require('../../server/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Use GET.' });
  try {
    const user = await userFrom(req);
    sendJson(res, 200, { email: user ? user.email : null });
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message || 'Could not read the session.' });
  }
};
