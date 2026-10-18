const { userFrom, getProgress, putProgress, readBody, sendJson } = require('../server/auth');

module.exports = async function handler(req, res) {
  try {
    const user = await userFrom(req);
    if (!user) return sendJson(res, 401, { error: 'Sign in first.' });
    if (req.method === 'GET') return sendJson(res, 200, await getProgress(user.id));
    if (req.method === 'PUT') {
      const body = await readBody(req);
      return sendJson(res, 200, await putProgress(user.id, body.data));
    }
    sendJson(res, 405, { error: 'Use GET or PUT.' });
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message || 'Could not save progress.' });
  }
};
