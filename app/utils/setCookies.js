import cookie from 'cookie';

import { environment } from 'eas.config';

export default function setCookies(res, authToken, clinicId) {
  const cookieOpts = {
    httpOnly: true,
    secure: environment !== 'local',
    sameSite: 'strict',
    maxAge: 86400 * 30,
    path: '/',
  };
  const cookies = [];
  if (authToken != null) {
    const tokenCookie = cookie.serialize(
      'auth_token',
      String(authToken),
      cookieOpts,
    );
    cookies.push(tokenCookie);
  }

  if (clinicId != null) {
    const clinicCookie = cookie.serialize(
      'clinic_id',
      String(clinicId) || '-1',
      cookieOpts,
    );
    cookies.push(clinicCookie);
  }
  res.setHeader('set-cookie', cookies);
}
