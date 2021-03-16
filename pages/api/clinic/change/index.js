import axios from "axios";
import { baseApiUrl, isDev } from "../../../../eas.config";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(changeSelectedClinic, req, res);
      if (data != null) {
        const selectedClinic = data.clinics.find((item) => item.isSelected);
        setCookies(res, selectedClinic.clinicId);
        res.json(selectedClinic);
      }
      break
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break
  }
});

function setCookies(res, clinicId) {
  const cookieOpts = {
    httpOnly: true,
    secure: !isDev,
    sameSite: 'strict',
    maxAge: 3600,
    path: '/'
  }
  const clinicCookie = cookie.serialize('clinic_id', clinicId, cookieOpts);
  res.setHeader('Set-Cookie', clinicCookie);
}

function changeSelectedClinic(req) {
  const { auth_token } = cookie.parse(req.headers.cookie);
  const { clinicId } = req.query;
  return axios.get(`${baseApiUrl}/authentication/v1/change-clinic/${clinicId}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': -1,
    }
  });
}
