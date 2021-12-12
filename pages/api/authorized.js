import cookie from 'cookie';

function isTokenPresent(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.auth_token != null;
}

const authorized = (fn) => async (req, res) => {
  if (isTokenPresent(req)) {
    return fn(req, res);
  }
  return res.status(401).json({ error: true, message: 'unauthorized' });
};

export default authorized;
