import axios from "axios";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import { getSubdomain, updatedServerUrl } from "../../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchPauseAvailableTime, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function fetchPauseAvailableTime(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.put(`${updatedServerUrl(req)}/pauses/available-time`, req.query, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
      'X-EasyPlan-Subdomain': getSubdomain(req),
    }
  });
}
