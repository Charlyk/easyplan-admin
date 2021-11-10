import axios from "axios";
import cookie from 'cookie';
import getSubdomain from "../../../app/utils/getSubdomain";
import { HeaderKeys } from "../../../app/utils/constants";
import updatedServerUrl from "../../../app/utils/updateServerUrl";
import { handler } from "../handler";
import { authorized } from "../authorized";

export const config = { api: { bodyParser: false } };

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'PUT': {
      const data = await handler(addReminder, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    case 'GET': {
      const data = await handler(fetchReminders, req, res);
      if (data != null) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['PUT', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function addReminder(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { dealId } = req.query;
  return axios.put(`${updatedServerUrl(req)}/crm/deals/reminders/${dealId}`, req.body, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}

async function fetchReminders(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const { dealId } = req.query;
  return axios.get(`${updatedServerUrl(req)}/crm/deals/reminders/${dealId}`, {
    headers: {
      [HeaderKeys.authorization]: auth_token,
      [HeaderKeys.clinicId]: clinic_id,
      [HeaderKeys.subdomain]: getSubdomain(req),
    }
  });
}
