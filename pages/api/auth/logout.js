import cookie from 'cookie';
import { environment } from 'eas.config';
import authorized from '../authorized';

function clearCookies(res, authToken, clinicId) {
  const cookieOpts = {
    httpOnly: true,
    secure: environment !== 'local',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  };
  const tokenCookie = cookie.serialize('auth_token', authToken, cookieOpts);
  const clinicCookie = cookie.serialize('clinic_id', clinicId, cookieOpts);
  res.setHeader('Set-Cookie', [tokenCookie, clinicCookie]);
}

export default authorized(async (req, res) => {
  clearCookies(res, '', -1);
  res.json({ message: 'OK' });
});
