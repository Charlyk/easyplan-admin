import axios from 'axios';
import cookie from 'cookie';
import { HeaderKeys } from 'app/utils/constants';
import getSubdomain from 'app/utils/getSubdomain';
import updatedServerUrl from 'app/utils/updateServerUrl';
import handler from '../handler';

async function fetchCountries(req) {
  const { clinic_id: clinicId, auth_token: authToken } = cookie.parse(
    req.headers.cookie,
  );
  const headers = {
    [HeaderKeys.subdomain]: getSubdomain(req),
  };
  if (clinicId) headers[HeaderKeys.clinicId] = clinicId;
  if (authToken) headers[HeaderKeys.authorization] = authToken;
  return axios.get(`${updatedServerUrl(req)}/countries`, { headers });
}

export default async function countries(req, res) {
  switch (req.method) {
    case 'GET': {
      const data = await handler(fetchCountries, req, res);
      if (data) {
        res.json(data);
      }
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
