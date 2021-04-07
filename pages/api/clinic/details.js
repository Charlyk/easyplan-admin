import axios from "axios";
import { baseApiUrl } from "../../../eas.config";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";

export default authorized(async function clinicDetails(req, res) {
  switch (req.method) {
    case 'GET': {
      const data = await handler(getClinicDetails, req, res);
      if (data != null) {
        res.json(data);
      }
      break
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break
  }
});

function getClinicDetails(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.get(`${baseApiUrl}/clinics/details`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
