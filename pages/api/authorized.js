import cookie from 'cookie';

export const authorized = (fn) => async (req, res) => {
  if (isTokenPresent(req)) {
    return await fn(req, res);
  }
  res.status(401).json({ error: true, message: 'unauthorized' });
};

function isTokenPresent(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.auth_token != null;
}
