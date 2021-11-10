import axios from "axios";
import cookie from 'cookie';
import getSubdomain from "../../../../app/utils/getSubdomain";
import updatedServerUrl from "../../../../app/utils/updateServerUrl";
import { HeaderKeys } from "../../../../app/utils/constants";
import { authorized } from "../../authorized";
import { handler } from "../../handler";


export const config = { api: { bodyParser: { sizeLimit: '100mb' } } };

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchScheduleDetails, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    case 'DELETE': {
      const data = await handler(deleteSchedule, req, res);
      if (data == null) {
        return;
      }
      res.json(data);
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function fetchScheduleDetails(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { scheduleId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/schedules/details/${scheduleId}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

async function deleteSchedule(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { scheduleId } = req.query;
  return axios.delete(`${updatedServerUrl(req)}/schedules/${scheduleId}/delete`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
