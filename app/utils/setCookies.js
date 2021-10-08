import { environment } from "../../eas.config";
import cookie from "cookie";

export default function setCookies(res, authToken, clinicId) {
  const cookieOpts = {
    httpOnly: true,
    secure: environment !== 'local',
    sameSite: 'strict',
    maxAge: 86400 * 30,
    path: '/'
  }
  const tokenCookie = cookie.serialize('auth_token', String(authToken), cookieOpts);
  const clinicCookie = cookie.serialize('clinic_id', String(clinicId) || '-1', cookieOpts);
  res.setHeader('set-cookie', [tokenCookie, clinicCookie]);
}
