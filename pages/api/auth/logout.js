import { isDev } from "../../../eas.config";
import { authorized } from "../authorized";
import cookie from 'cookie';

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'DELETE': {
      clearCookies(res, '', -1);
      res.json({ message: 'OK' });
      break;
    }
    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

function clearCookies(res, authToken, clinicId) {
  const cookieOpts = {
    httpOnly: true,
    secure: !isDev,
    sameSite: 'strict',
    maxAge: -1,
    path: '/'
  }
  const tokenCookie = cookie.serialize('auth_token', authToken, cookieOpts);
  const clinicCookie = cookie.serialize('clinic_id', clinicId, cookieOpts);
  res.setHeader('Set-Cookie', [tokenCookie, clinicCookie]);
}
