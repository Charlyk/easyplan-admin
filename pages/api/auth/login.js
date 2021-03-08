import { baseApiUrl, isDev } from "../../../eas.config";
import axios from 'axios';
import cookie from 'cookie'

export default async function login(req, res) {
  const { username, password } = req.body;
  const response = await authenticateWithBackend(username, password);
  if (response.status !== 200) {
    res.json({ error: true, message: 'wrong_username_or_password' });
  } else {
    const { isError, message, data } = response.data;
    if (isError) {
      res.json({ message, error: true });
    } else {
      const { user, token } = data;
      let selectedClinic = null;
      if (user.clinics.length > 0) {
        selectedClinic = user.clinics.find(clinic => clinic.isSelected) || user.clinics[0]
      }
      setCookies(res, token, selectedClinic?.clinicId || -1);
      res.status(200).json(user);
    }
  }
}

function setCookies(res, authToken, clinicId) {
  const cookieOpts = {
    httpOnly: true,
    secure: !isDev,
    sameSite: 'strict',
    maxAge: 3600,
    path: '/'
  }
  const tokenCookie = cookie.serialize('auth_token', authToken, cookieOpts);
  const clinicCookie = cookie.serialize('clinic_id', clinicId, cookieOpts);
  res.setHeader('Set-Cookie', [tokenCookie, clinicCookie]);
}

/**
 * Authenticate an user with EasyPlan backend
 * @param username
 * @param password
 * @return {Promise<AxiosResponse<any>>}
 */
function authenticateWithBackend(username, password) {
  return axios.post(
    `${baseApiUrl}/authentication/v1/login`,
    { username, password },
    { headers: { 'X-EasyPlan-Clinic-Id': -1 } }
  );
}
