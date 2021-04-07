import { isDev } from "../../../eas.config";
import { authorized } from "../authorized";
import cookie from 'cookie';

export default authorized(async (req, res) => {
  clearCookies(res, '', -1);
  res.json({ message: 'OK' });
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
