import axios from "axios";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";
import { updatedServerUrl } from "../../../../utils/helperFuncs";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchScheduleDetails, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

function fetchScheduleDetails(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { scheduleId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/schedules/details/${scheduleId}`, {
    headers: {
      Authorization: auth_token,
      'X-EasyPlan-Clinic-Id': clinic_id,
    }
  });
}
