import axios from "axios";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import { updatedServerUrl } from "../../../../utils/helperFuncs";

export default authorized(async function clinicDetails(req, res) {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(updateBracesSettings, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function updateBracesSettings(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const requestBody = req.body;
  return axios.put(`${updatedServerUrl(req)}/clinics/braces-types`, requestBody, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
