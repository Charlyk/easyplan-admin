import axios from "axios";
import { environment } from "../../../../eas.config";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import getSubdomain from "../../../../utils/getSubdomain";
import updatedServerUrl from "../../../../utils/updateServerUrl";
import { HeaderKeys } from "../../../../app/utils/constants";

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
    secure: environment !== 'local',
    sameSite: 'strict',
    maxAge: 36000,
    path: '/'
  }
  const clinicCookie = cookie.serialize('clinic_id', clinicId, cookieOpts);
  res.setHeader('Set-Cookie', clinicCookie);
}

function changeSelectedClinic(req) {
  const { auth_token } = cookie.parse(req.headers.cookie);
  const { clinicId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/authentication/v1/change-clinic/${clinicId}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: -1,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
