import axios from "axios";
import { baseApiUrl } from "../../../../eas.config";
import { authorized } from "../../authorized";
import cookie from 'cookie';
import { handler } from "../../handler";

export default authorized(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchPatientOrthodonticPlan, req, res);
      res.json(data);
      break;
    }
    case 'POST': {
      const data = await handler(updateOrthodonticPlan, req, res);
      res.json(data);
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
});

async function updateOrthodonticPlan(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  return axios.post(
    `${baseApiUrl}/treatment-plans/orthodontic`,
    req.body,
    {
      headers: {
        Authorization: auth_token,
        'X-EasyPlan-Clinic-Id': clinic_id,
      }
    }
  );
}

function fetchPatientOrthodonticPlan(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query).toString()
  return axios.get(
    `${baseApiUrl}/treatment-plans/orthodontic?${queryString}`,
    {
      headers: {
        Authorization: auth_token,
        'X-EasyPlan-Clinic-Id': clinic_id,
      }
    }
  );
}