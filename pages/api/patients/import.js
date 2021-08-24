import axios from "axios";
import { authorized } from "../authorized";
import cookie from 'cookie';
import { handler } from "../handler";
import { getSubdomain, updatedServerUrl } from "../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const data = await handler(importPatients, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break
  }
});

function importPatients(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.post(`${updatedServerUrl(req)}/patients/import`, req.body, {
    headers: {
      ...req.headers,
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
      'X-EasyPlan-Subdomain': getSubdomain(req),
    }
  });
}
