import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import { authorized } from '../../authorized';
import { handler } from '../../handler';

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
    `${updatedServerUrl(req)}/treatment-plans/orthodontic`,
    req.body,
    {
      headers: {
        [HeaderKeys.authorization]: auth_token,
        [HeaderKeys.clinicId]: clinic_id,
        [HeaderKeys.subdomain]: getSubdomain(req),
        [HeaderKeys.contentType]: 'application/json',
      },
    },
  );
}

function fetchPatientOrthodonticPlan(req) {
  const { clinic_id, auth_token } = cookie.parse(req.headers.cookie);
  const queryString = new URLSearchParams(req.query).toString();
  return axios.get(
    `${updatedServerUrl(req)}/treatment-plans/orthodontic?${queryString}`,
    {
      headers: {
        [HeaderKeys.authorization]: auth_token,
        [HeaderKeys.clinicId]: clinic_id,
        [HeaderKeys.subdomain]: getSubdomain(req),
      },
    },
  );
}
