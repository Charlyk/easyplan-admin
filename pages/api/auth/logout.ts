import cookie, { CookieSerializeOptions } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { environment } from 'eas.config';
import authorized from '../authorized';

function clearCookies(
  res: NextApiResponse,
  authToken: string,
  clinicId: number,
) {
  const cookieOpts: CookieSerializeOptions = {
    httpOnly: true,
    secure: environment !== 'local',
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  };
  const tokenCookie = cookie.serialize('auth_token', authToken, cookieOpts);
  const clinicCookie = cookie.serialize(
    'clinic_id',
    String(clinicId),
    cookieOpts,
  );
  res.setHeader('Set-Cookie', [tokenCookie, clinicCookie]);
}

export default authorized(async (req: NextApiRequest, res: NextApiResponse) => {
  clearCookies(res, '', -1);
  res.json({ message: 'OK' });
});
