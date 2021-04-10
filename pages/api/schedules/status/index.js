import axios from "axios";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import { getSubdomain, updatedServerUrl } from "../../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(updateScheduleStatus, req, res);
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

function updateScheduleStatus(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query).toString();
  const requestBody = req.body;
  return axios.put(
    `${updatedServerUrl(req)}/schedules/schedule-status?${queryString}`,
    requestBody,
    {
      headers: {
        Authorization: auth_token,
        'X-EasyPlan-Clinic-Id': clinic_id,
        'X-EasyPlan-Subdomain': getSubdomain(req),
      }
    }
  );
}
